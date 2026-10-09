import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class SampleQueryDto {
  @Length(1, 20, { message: i18nValidationMessage('validation.Length') })
  @IsString({ message: i18nValidationMessage('validation.IsString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IsNotEmpty') })
  sample_foo: string;

  @IsIn([0, 1, 2, 3], { message: i18nValidationMessage('validation.IsIn') })
  @IsInt({ message: i18nValidationMessage('validation.IsInt') })
  @Type(() => Number)
  @IsOptional()
  sample_bar: number;
}
