import { UpdateArticleDto } from '../dto/update-article.dto';

export class UpdateArticleCommand {
  constructor(
    public readonly articleDto: UpdateArticleDto,
    public readonly file: Express.Multer.File,
  ) {}
}
