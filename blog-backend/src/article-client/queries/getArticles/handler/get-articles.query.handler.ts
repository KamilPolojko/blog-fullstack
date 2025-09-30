import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArticlesQuery } from '../impl/get-articles.query';
import { ArticleService } from '../../../article.service';
import { ArticleDto } from '../dto/article.dto';

@QueryHandler(GetArticlesQuery)
export class GetArticlesQueryHandler
  implements IQueryHandler<GetArticlesQuery>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(
    query: GetArticlesQuery,
  ): Promise<{ articles: ArticleDto[]; total: number }> {
    const skip = query.articleRequestDto.skip ?? 0;
    const take = query.articleRequestDto.take ?? 10;
    const sortBy = query.articleRequestDto.sortBy || 'createdAt';
    const order = query.articleRequestDto.order || 'DESC';
    const categories = query.articleRequestDto.categories || [];

    return this.articleService.findAll(skip, take, sortBy, order, categories);
  }
}
