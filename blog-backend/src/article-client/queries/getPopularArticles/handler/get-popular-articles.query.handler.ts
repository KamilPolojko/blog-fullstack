import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleService } from '../../../article.service';
import { GetPopularArticlesQuery } from '../impl/get-popular-articles.query';
import { ArticleDto } from '../../getArticles/dto/article.dto';

@QueryHandler(GetPopularArticlesQuery)
export class GetPopularArticlesQueryHandler
  implements IQueryHandler<GetPopularArticlesQuery>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(
    query: GetPopularArticlesQuery,
  ): Promise<{ articles: ArticleDto[]; total: number }> {
    return this.articleService.findPopular(query.skip, query.take);
  }
}
