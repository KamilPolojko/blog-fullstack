import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteArticleCommand } from '../impl/delete-article.command';
import { ArticleService } from '../../../article.service';

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCommandHandler
  implements ICommandHandler<DeleteArticleCommand>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    await this.articleService.remove(command.uuid);
  }
}
