import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ToggleLikeCommand } from '../impl/toggle-like.command';
import { CommentLikesService } from '../../../comment.likes.service';

@CommandHandler(ToggleLikeCommand)
export class ToggleLikeCommandHandler
  implements ICommandHandler<ToggleLikeCommand>
{
  constructor(private readonly commentLikesService: CommentLikesService) {}

  async execute(command: ToggleLikeCommand): Promise<{ liked: boolean }> {
    return this.commentLikesService.toggleLike(
      command.commentId,
      command.userId,
    );
  }
}
