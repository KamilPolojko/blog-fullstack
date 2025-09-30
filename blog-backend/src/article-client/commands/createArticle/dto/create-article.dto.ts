import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tablica kategorii',
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Czy artykuł jest aktywny',
    default: 'true',
  })
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiProperty({
    description: 'Szacowany czas czytania w minutach',
    default: '5',
  })
  @IsOptional()
  @IsString()
  readingTime?: string;

  @ApiProperty({
    example: '2025-09-10T14:23:00.000Z',
    description: 'Data utworzenia artykułu',
  })
  @IsNotEmpty()
  @IsString()
  createdAt: string;
}
