import { CreateArticleDto } from '../dto/create-article.dto';

export class CreateArticleCommand {
  constructor(
    public readonly articleDto: CreateArticleDto,
    public readonly file: Express.Multer.File,
  ) {}
}
