import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({
    default: '',
  })
  @IsString()
  code: string;
}
