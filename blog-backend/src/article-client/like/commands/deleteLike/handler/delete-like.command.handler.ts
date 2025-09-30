import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeService } from '../../../like.service';
import { DeleteLikeCommand } from '../impl/delete-like.command';

@CommandHandler(DeleteLikeCommand)
export class DeleteLikeCommandHandler
  implements ICommandHandler<DeleteLikeCommand>
{
  constructor(private readonly likeService: LikeService) {}

  async execute(command: DeleteLikeCommand): Promise<void> {
    await this.likeService.removeLikeForUser(command.articleId, command.userId);
  }
}
