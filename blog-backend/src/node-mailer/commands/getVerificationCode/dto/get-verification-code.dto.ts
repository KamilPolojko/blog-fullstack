import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NoWhitespace } from '../../../../user-client/decorators/no-whitespace.decorator';

export class GetVerificationCodeDto {
  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  @NoWhitespace()
  @IsEmail()
  email: string;
}
