import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCommentsForArticleQuery } from '../impl/get-all-comments-for-article.query';
import { CommentService } from '../../../comment.service';
import { CommentResponseDto } from '../dto/CommentResponseDto';

@QueryHandler(GetAllCommentsForArticleQuery)
export class GetAllCommentsForArticleQueryHandler
  implements IQueryHandler<GetAllCommentsForArticleQuery>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(
    query: GetAllCommentsForArticleQuery,
  ): Promise<CommentResponseDto> {
    return await this.commentService.getAllCommentsForArticle(query.articleId);
  }
}
