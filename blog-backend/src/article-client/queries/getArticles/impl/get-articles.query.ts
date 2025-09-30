import { ArticleRequestDto } from '../dto/article.request.dto';

export class GetArticlesQuery {
  constructor(public readonly articleRequestDto: ArticleRequestDto) {}
}
