import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentLikesService } from '../../../comment.likes.service';
import { IsLikedByCurrentLoggedUserQuery } from '../impl/is-liked-by-current-logged-user.query';

@QueryHandler(IsLikedByCurrentLoggedUserQuery)
export class IsLikedByCurrentLoggedUserQueryHandler
  implements IQueryHandler<IsLikedByCurrentLoggedUserQuery>
{
  constructor(private readonly commentLikesService: CommentLikesService) {}

  async execute(query: IsLikedByCurrentLoggedUserQuery): Promise<boolean> {
    return await this.commentLikesService.isLikedByUser(
      query.commentId,
      query.userId,
    );
  }
}
