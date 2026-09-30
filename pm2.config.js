module.exports = {
  apps: [
    {
      name: process.env.APP_TITLE,
      script: 'main.js',
      exec_mode: 'cluster',
      instances: process.env.PM2_WORKERS ?? 'max',
      instance_var: 'INSTANCE_ID', // 指定cluster中实例的唯一标识, 会从0开始自增, 用于控制多实例内不同定时任务处理数据的范围
    },
  ],
};
