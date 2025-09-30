import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticleService } from '../../../article.service';
import { UpdateArticleCommand } from '../impl/update-article.command';

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCommandHandler
  implements ICommandHandler<UpdateArticleCommand>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(command: UpdateArticleCommand): Promise<void> {
    await this.articleService.updateArticleWithImage(
      command.articleDto,
      command.file,
    );
  }
}
