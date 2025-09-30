import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddLikeCommand } from '../impl/add-like.command';
import { LikeService } from '../../../like.service';

@CommandHandler(AddLikeCommand)
export class AddLikeCommandHandler implements ICommandHandler<AddLikeCommand> {
  constructor(private readonly likeService: LikeService) {}

  async execute(command: AddLikeCommand): Promise<void> {
    await this.likeService.addLike(command.likeDTO);
  }
}
