import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSavedArticlesQuery } from '../impl/get-all-saved-articles.query';
import { SavedArticleService } from '../../../saved-article.service';
import { ArticleDto } from '../../../../queries/getArticles/dto/article.dto';

@QueryHandler(GetAllSavedArticlesQuery)
export class GetAllSavedArticlesQueryHandler
  implements IQueryHandler<GetAllSavedArticlesQuery>
{
  constructor(private readonly savedArticleService: SavedArticleService) {}

  async execute(
    command: GetAllSavedArticlesQuery,
  ): Promise<{ articles: ArticleDto[]; hasMore: boolean }> {
    return await this.savedArticleService.getSavedArticles(
      command.userId,
      command.offset,
      command.limit,
    );
  }
}
