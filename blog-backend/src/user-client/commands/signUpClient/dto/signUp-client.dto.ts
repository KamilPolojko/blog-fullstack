import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { NoWhitespace } from '../../../decorators/no-whitespace.decorator';

export class signUpClientDTO {
  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @MaxLength(20)
  username: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  })
  passwordRepeat?: string;
}
