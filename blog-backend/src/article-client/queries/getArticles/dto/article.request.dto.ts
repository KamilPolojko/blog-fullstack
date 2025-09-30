import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderType } from '../../../types/orderType';

export class ArticleRequestDto {
  @ApiProperty({})
  @IsNotEmpty()
  skip: number;

  @ApiProperty({})
  @IsNotEmpty()
  take: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    enum: OrderType,
    enumName: 'OrderType',
    required: false,
  })
  order?: OrderType;

  @ApiProperty({
    description: 'Categories array',
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
