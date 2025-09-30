import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleService } from '../../../article.service';
import { GetArticlesCreatedByClientQuery } from '../impl/get-articles-created-by-client.query';
import { PaginatedArticlesDto } from '../dto/PaginatedArticlesDto';

@QueryHandler(GetArticlesCreatedByClientQuery)
export class GetArticlesCreatedByClientQueryHandler
  implements IQueryHandler<GetArticlesCreatedByClientQuery>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(
    query: GetArticlesCreatedByClientQuery,
  ): Promise<PaginatedArticlesDto> {
    const { userId, dto } = query;
    return await this.articleService.findAllByAuthor(userId, dto);
  }
}
