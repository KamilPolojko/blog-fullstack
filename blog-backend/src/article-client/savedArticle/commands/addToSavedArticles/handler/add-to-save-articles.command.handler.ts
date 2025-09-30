import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddToSaveArticlesCommand } from '../impl/add-to-save-articles.command';
import { SavedArticleService } from '../../../saved-article.service';

@CommandHandler(AddToSaveArticlesCommand)
export class AddToSaveArticlesCommandHandler
  implements ICommandHandler<AddToSaveArticlesCommand>
{
  constructor(private readonly savedArticleService: SavedArticleService) {}

  async execute(command: AddToSaveArticlesCommand): Promise<void> {
    await this.savedArticleService.saveArticle(
      command.clientId,
      command.articleId,
    );
  }
}
