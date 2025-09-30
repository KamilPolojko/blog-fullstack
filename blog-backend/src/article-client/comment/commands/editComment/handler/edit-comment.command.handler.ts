import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentService } from '../../../comment.service';
import { EditCommentCommand } from '../impl/edit-comment.command';

@CommandHandler(EditCommentCommand)
export class EditCommentCommandHandler
  implements ICommandHandler<EditCommentCommand>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(command: EditCommentCommand): Promise<void> {
    await this.commentService.editComment(command.commentId, command.content);
  }
}
