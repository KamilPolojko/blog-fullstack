import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCommentCommand } from '../impl/add-comment.command';
import { CommentService } from '../../../comment.service';
import { Comment } from '../../../../entities/comment.entity';

@CommandHandler(AddCommentCommand)
export class AddCommentCommandHandler
  implements ICommandHandler<AddCommentCommand>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(command: AddCommentCommand): Promise<Comment> {
    return await this.commentService.addComment(command.commentDTO);
  }
}
