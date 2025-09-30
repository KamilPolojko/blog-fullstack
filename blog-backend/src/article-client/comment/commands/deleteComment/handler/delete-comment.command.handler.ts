import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../impl/delete-comment.command';
import { CommentService } from '../../../comment.service';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    await this.commentService.removeComment(command.commentId);
  }
}
