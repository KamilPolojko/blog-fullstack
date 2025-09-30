import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArticleCommand } from '../impl/create-article.command';
import { ArticleService } from '../../../article.service';

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(private readonly articleService: ArticleService) {}

  async execute(command: CreateArticleCommand): Promise<void> {
    await this.articleService.createArticleWithImage(
      command.articleDto,
      command.file,
    );
  }
}
