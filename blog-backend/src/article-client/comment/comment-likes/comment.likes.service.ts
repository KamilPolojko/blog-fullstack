import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from '../../entities/comment.like.entity';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { ArticleGateway } from '../../articles.gateway';
import { NotificationType } from '../../../notification/types/NotificationType';
import { NotificationService } from '../../../notification/notification.service';

@Injectable()
export class CommentLikesService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly likeRepo: Repository<CommentLike>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ArticleGateway))
    private readonly articleGateway: ArticleGateway,
  ) {}

  async toggleLike(
    commentId: string,
    userId: string,
  ): Promise<{ liked: boolean }> {
    const existing = await this.likeRepo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
      relations: ['comment', 'comment.article'],
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      const newCount = await this.countLikes(commentId);
      this.articleGateway.emitCommentUnliked(
        commentId,
        existing.comment.article.id,
        userId,
        newCount,
      );
      return { liked: false };
    }

    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['article', 'author'],
    });

    if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

    const like = this.likeRepo.create({ comment, user: { id: userId } });
    await this.likeRepo.save(like);

    if (comment.author?.id !== userId) {
      await this.notificationService.createNotification(
        comment.author.id,
        userId,
        NotificationType.COMMENT_LIKED,
        comment.article,
        comment,
      );
    }

    const newCount = await this.countLikes(commentId);
    this.articleGateway.emitCommentLiked(
      commentId,
      comment.article.id,
      userId,
      newCount,
    );
    return { liked: true };
  }

  async countLikes(commentId: string): Promise<number> {
    return this.likeRepo.count({ where: { comment: { id: commentId } } });
  }

  async isLikedByUser(commentId: string, userId: string): Promise<boolean> {
    const like = await this.likeRepo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });
    return !!like;
  }
}
