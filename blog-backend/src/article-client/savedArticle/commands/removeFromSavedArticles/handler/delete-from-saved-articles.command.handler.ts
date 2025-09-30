import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFromSavedArticlesCommand } from '../impl/delete-from-saved-articles.command';
import { SavedArticleService } from '../../../saved-article.service';

@CommandHandler(DeleteFromSavedArticlesCommand)
export class DeleteFromSavedArticlesCommandHandler
  implements ICommandHandler<DeleteFromSavedArticlesCommand>
{
  constructor(private readonly savedArticleService: SavedArticleService) {}

  async execute(command: DeleteFromSavedArticlesCommand): Promise<void> {
    await this.savedArticleService.removeSavedArticle(
      command.userId,
      command.articleId,
    );
  }
}
