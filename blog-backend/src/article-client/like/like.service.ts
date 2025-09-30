import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Client } from '../../user-client/entities/client.entity';
import { Article } from '../entities/article.entity';
import { LikeDTO } from './commands/addLike/dto/LikeDTO';
import { ArticleGateway } from '../articles.gateway';
import { AllLikesDTO } from './queries/getAllLikes/dto/AllLikesDto';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '../../notification/types/NotificationType';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ArticleGateway))
    private readonly articleGateway: ArticleGateway,
  ) {}

  async addLike(dto: LikeDTO): Promise<Like> {
    const user = await this.clientRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    const article = await this.articleRepository.findOne({
      where: { id: dto.articleId },
      relations: ['author'],
    });

    if (!article) throw new NotFoundException('Article not found');

    const alreadyLiked = await this.likeRepository.findOne({
      where: { article: { id: dto.articleId }, user: { id: dto.userId } },
    });
    if (alreadyLiked) throw new BadRequestException('Already liked');

    const like = this.likeRepository.create({ article, user });
    const savedLike = await this.likeRepository.save(like);

    if (article.author?.id !== user.id) {
      await this.notificationService.createNotification(
        article.author.id,
        user.id,
        NotificationType.ARTICLE_LIKED,
        article,
        undefined,
      );
    }

    const likesCount = await this.likeRepository.count({
      where: { article: { id: article.id } },
    });

    this.articleGateway.emitArticleLiked(article.id, user.id, likesCount);

    return savedLike;
  }

  async getAllLikesForArticle(articleId: string): Promise<AllLikesDTO> {
    const likes = await this.likeRepository.find({
      where: { article: { id: articleId } },
      relations: ['user'],
    });

    const count = await this.likeRepository.count({
      where: { article: { id: articleId } },
    });

    return { likes, count };
  }

  async removeLikeForUser(articleId: string, userId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
    });
    if (!like) throw new NotFoundException('Like not found');
    await this.likeRepository.remove(like);

    const likesCount = await this.likeRepository.count({
      where: { article: { id: articleId } },
    });

    this.articleGateway.emitArticleUnliked(articleId, userId, likesCount);
  }
}
