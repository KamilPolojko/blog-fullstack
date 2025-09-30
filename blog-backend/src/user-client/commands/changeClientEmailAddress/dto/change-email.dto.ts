import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NoWhitespace } from '../../../decorators/no-whitespace.decorator';

export class changeEmailDTO {
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
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @IsEmail()
  repeatNewEmail: string;
}
