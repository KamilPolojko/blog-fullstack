import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentLikesCountQuery } from '../impl/get-comment-likes-count.query';
import { CommentLikesService } from '../../../comment.likes.service';

@QueryHandler(GetCommentLikesCountQuery)
export class GetCommentLikesCountQueryHandler
  implements IQueryHandler<GetCommentLikesCountQuery>
{
  constructor(private readonly commentLikesService: CommentLikesService) {}

  async execute(query: GetCommentLikesCountQuery): Promise<number> {
    return await this.commentLikesService.countLikes(query.commentId);
  }
}
