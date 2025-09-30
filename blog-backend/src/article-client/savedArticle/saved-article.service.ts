import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { Article } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from '../queries/getArticles/dto/article.dto';
import { NotificationType } from '../../notification/types/NotificationType';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class SavedArticleService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private readonly notificationService: NotificationService,
  ) {}

  async saveArticle(clientId: string, articleId: string): Promise<void> {
    const user = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['savedArticles'],
    });
    if (!user) throw new NotFoundException('User not found');

    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['author'],
    });
    if (!article) throw new NotFoundException('Article not found');

    if (user.savedArticles.some((a) => a.id === articleId)) {
      throw new BadRequestException('Already saved');
    }

    user.savedArticles.push(article);

    if (article.author?.id !== clientId) {
      await this.notificationService.createNotification(
        article.author.id,
        clientId,
        NotificationType.ARTICLE_SAVED,
        article,
        undefined,
      );
    }

    await this.clientRepository.save(user);
  }

  async removeSavedArticle(userId: string, articleId: string): Promise<void> {
    const user = await this.clientRepository.findOne({
      where: { id: userId },
      relations: ['savedArticles'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.savedArticles = user.savedArticles.filter((a) => a.id !== articleId);
    await this.clientRepository.save(user);
  }

  async getSavedArticles(
    userId: string,
    offset = 0,
    limit = 8,
  ): Promise<{ articles: ArticleDto[]; hasMore: boolean }> {
    const user = await this.clientRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const [articles, total] = await this.articleRepository.findAndCount({
      relations: [
        'author',
        'author.profile',
        'comments',
        'likes',
        'likes.user',
        'savedBy',
      ],
      where: { savedBy: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return {
      articles: articles.map((article) => ({
        ...article,
        savedByCount: article.savedBy?.length ?? 0,
      })),
      hasMore: offset + limit < total,
    };
  }
}
