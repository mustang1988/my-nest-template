/**
 * prettier插件: 按表达式长度排序import
 *
 * 排序规则:
 * 1. 单行import表达式按整句长度升序排列; 长度相同时from关键字位置靠前的在上; 再相同时按from路径字典序升序
 * 2. 多行import表达式的被导入成员按标识符长度升序排列(type前缀不参与计长), 上短下长; 同长按标识符字典序升序
 * 3. 多行与单行表达式混排时, 多行表达式以"} from ..."结尾行的长度作为比较基准参与语句间排序, 排序规则的其余部分同样作用在该结尾行上
 *
 * 本插件通过包装prettier内置的typescript/babel-ts解析器的preprocess阶段实现, 在解析前对文件顶部连续的import语句块做文本级重排;
 * 仅重排顺序, 不改变任何import表达式的语义与格式(引号/尾逗号风格/缩进均保持原样)
 */

import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

/**
 * 解析多行import表达式: 返回成员列表与格式信息, 解析失败返回null
 *
 * @param stmtLines 多行表达式的行列表
 * @return 首行/结尾行/成员列表/成员缩进/尾逗号风格
 */
function parseMultiLine(stmtLines) {
  const first = stmtLines[0];
  const last = stmtLines[stmtLines.length - 1];
  // 首行须以'{'结尾, 结尾行须为'} from ...;'形式
  if (!first.trimEnd().endsWith('{') || !/^\}\s*(type\s+)?from\s+['"]/.test(last.trim())) {
    return null;
  }
  const memberLines = stmtLines.slice(1, -1);
  if (memberLines.length === 0) {
    return null;
  }
  const indent = memberLines[0].match(/^[ \t]*/)[0];
  const members = memberLines.map((line) => line.trim().replace(/,$/, ''));
  const trailingComma = memberLines[memberLines.length - 1].trim().endsWith(',');
  return { first, last, members, indent, trailingComma };
}

/**
 * 成员排序: 按去掉type前缀的标识符长度升序, 同长按标识符字典序升序
 *
 * @param members 成员列表
 * @return 排序后的成员列表
 */
function sortMembers(members) {
  const nameOf = (member) => member.replace(/^type\s+/, '');
  return [...members].sort((a, b) => {
    const nameA = nameOf(a);
    const nameB = nameOf(b);
    return nameA.length - nameB.length || (nameA < nameB ? -1 : nameA > nameB ? 1 : 0);
  });
}

/**
 * 计算排序键: (比较基准行长度, from关键字位置, from路径, 原相对顺序)
 *
 * 多行表达式的比较基准行为其"} from ..."结尾行
 *
 * @param compareLine 比较基准行
 * @param idx 表达式原始顺序
 * @return 排序键
 */
function sortKeys(compareLine, idx) {
  const fromMatch = compareLine.match(/from\s+['"]([^'"]+)['"]/);
  return {
    length: compareLine.length,
    fromPosition: fromMatch ? compareLine.indexOf(fromMatch[0]) : -1,
    fromPath: fromMatch ? fromMatch[1] : '',
    idx,
  };
}

/**
 * 重排文件顶部连续的import语句块
 *
 * @param text 源码文本
 * @return 重排后的源码文本
 */
function sortImports(text) {
  const lines = text.split('\n');
  // 收集文件顶部连续的import语句
  let i = 0;
  const statements = [];
  while (i < lines.length) {
    const line = lines[i];
    if (!line.startsWith('import ')) {
      break;
    }
    const stmtLines = [line];
    i++;
    while (i < lines.length && !stmtLines[stmtLines.length - 1].trimEnd().endsWith(';')) {
      stmtLines.push(lines[i]);
      i++;
    }
    if (!stmtLines[stmtLines.length - 1].trimEnd().endsWith(';')) {
      // 未正常终结的import表达式, 不做处理
      return text;
    }
    statements.push(stmtLines);
  }
  if (statements.length < 2) {
    return text;
  }

  const processed = statements.map((stmtLines, idx) => {
    let text_ = stmtLines.join('\n');
    let multiLine = false;
    if (stmtLines.length > 1) {
      const parsed = parseMultiLine(stmtLines);
      if (parsed) {
        multiLine = true;
        const sorted = sortMembers(parsed.members);
        const newMembers = sorted.map((member, memberIdx) => {
          const isLast = memberIdx === sorted.length - 1;
          return parsed.indent + member + (isLast && !parsed.trailingComma ? '' : ',');
        });
        text_ = [parsed.first, ...newMembers, parsed.last].join('\n');
      }
    }
    // 多行表达式以"} from ..."结尾行为比较基准行, 单行表达式为其自身
    const compareLine = (multiLine ? stmtLines[stmtLines.length - 1] : stmtLines[0]).trim();
    return { text: text_, ...sortKeys(compareLine, idx) };
  });

  processed.sort(
    (a, b) =>
      a.length - b.length || a.fromPosition - b.fromPosition || (a.fromPath < b.fromPath ? -1 : a.fromPath > b.fromPath ? 1 : 0) || a.idx - b.idx,
  );

  return [...processed.map((stmt) => stmt.text), ...lines.slice(i)].join('\n');
}

/**
 * 包装解析器: 在原preprocess之后追加import语句块重排
 *
 * @param parser 待包装的解析器
 * @return 包装后的解析器
 */
function wrapParser(parser) {
  return {
    ...parser,
    preprocess(text, options) {
      const preprocessed = typeof parser.preprocess === 'function' ? parser.preprocess(text, options) : text;
      return sortImports(preprocessed);
    },
  };
}

export default {
  name: 'prettier-plugin-sort-imports-by-length',
  parsers: {
    typescript: wrapParser(typescriptParsers.typescript),
    'babel-ts': wrapParser(babelParsers['babel-ts']),
  },
};
