import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleService } from '../../../article.service';
import { GetArticleQuery } from '../impl/get-article.query';
import { ArticleDto } from '../../getArticles/dto/article.dto';

@QueryHandler(GetArticleQuery)
export class GetArticleQueryHandler implements IQueryHandler<GetArticleQuery> {
  constructor(private readonly articleService: ArticleService) {}

  async execute(query: GetArticleQuery): Promise<ArticleDto | null> {
    return this.articleService.findOneById(query.articleId);
  }
}
