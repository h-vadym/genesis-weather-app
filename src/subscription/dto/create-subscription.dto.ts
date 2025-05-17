import { Frequency } from '@libs/typeorm';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsDefined()
  @IsEnum(Frequency)
  frequency: Frequency;
}
