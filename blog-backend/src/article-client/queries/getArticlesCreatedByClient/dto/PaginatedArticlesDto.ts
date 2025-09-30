import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from '../../getArticles/dto/article.dto';
import { PaginationMetaDto } from './pagination.meta.dto';

export class PaginatedArticlesDto {
  @ApiProperty({
    type: [ArticleDto],
    description: 'Array of articles',
  })
  data: ArticleDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  pagination: PaginationMetaDto;
}
