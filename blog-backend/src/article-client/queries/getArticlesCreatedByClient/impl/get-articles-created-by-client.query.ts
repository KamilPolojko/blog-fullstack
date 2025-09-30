import { GetArticlesQueryDto } from '../dto/get.articles.query.dto';

export class GetArticlesCreatedByClientQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: GetArticlesQueryDto,
  ) {}
}
