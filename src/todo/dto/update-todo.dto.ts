
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

import { VALIDATION_MESSAGES } from '../../common/validation-messages';
import { StatusEnum } from '../enums/status.enum';
export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.name.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.name.required })
  @MinLength(3, { message: VALIDATION_MESSAGES.name.minLength })
  @MaxLength(10, { message: VALIDATION_MESSAGES.name.maxLength })
  name?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.description.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.description.required })
  @MinLength(10, {
    message: VALIDATION_MESSAGES.description.minLength,
  })
  description?: string;

  @IsOptional()
  @IsEnum(StatusEnum, {
    message: VALIDATION_MESSAGES.status.isEnum,
  })
  status?: StatusEnum;
}
