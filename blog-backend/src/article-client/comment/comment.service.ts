import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Client } from '../../user-client/entities/client.entity';
import { Comment } from '../entities/comment.entity';
import { AddCommentDTO } from './commands/addComment/dto/AddCommentDTO';
import { ArticleGateway } from '../articles.gateway';
import { CommentResponseDto } from './queries/getAllCommentsForArticle/dto/CommentResponseDto';
import { CommentDto } from './queries/getAllCommentsForArticle/dto/CommentDto';
import { NotificationType } from '../../notification/types/NotificationType';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ArticleGateway))
    private readonly articleGateway: ArticleGateway,
  ) {}

  async addComment(dto: AddCommentDTO): Promise<Comment> {
    if (!dto.content?.trim()) throw new BadRequestException('Content required');

    const user = await this.clientRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const article = await this.articleRepository.findOne({
      where: { id: dto.articleId },
      relations: ['author'],
    });

    if (!article) throw new NotFoundException('Article not found');

    const parentComment = dto.parentId
      ? ((await this.commentRepository.findOne({
          where: { id: dto.parentId },
          relations: ['author'],
        })) ?? undefined)
      : undefined;

    const comment = this.commentRepository.create({
      article,
      author: user,
      content: dto.content,
      parent: parentComment,
    });

    const savedComment = await this.commentRepository.save(comment);

    const isReply = !!parentComment;
    const recipientId = isReply ? parentComment.author?.id : article.author?.id;
    const notificationType = isReply
      ? NotificationType.REPLY_ADDED
      : NotificationType.COMMENT_ADDED;

    if (recipientId && recipientId !== dto.userId) {
      await this.notificationService.createNotification(
        recipientId,
        dto.userId,
        notificationType,
        article,
        savedComment,
      );
    }

    this.articleGateway.emitNewComment(savedComment);

    return savedComment;
  }

  async editComment(commentId: string, content: string): Promise<Comment> {
    if (!content?.trim()) {
      throw new BadRequestException('Content required');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'author.profile', 'article'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = content;
    const updatedComment = await this.commentRepository.save(comment);

    this.articleGateway.emitEditedComment(updatedComment);

    return updatedComment;
  }

  async getAllCommentsForArticle(
    articleId: string,
  ): Promise<CommentResponseDto> {
    const comments = await this.commentRepository.find({
      where: { article: { id: articleId } },
      relations: ['author', 'author.profile', 'parent'],
      order: { createdAt: 'ASC' },
    });

    const totalCount = comments.length;
    const map = new Map<string, CommentDto>();

    comments.forEach((c) => {
      const commentDto: CommentDto = {
        id: c.id,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        children: [],
        author: c.author,
      };
      map.set(c.id, commentDto);
    });

    const roots: CommentDto[] = [];

    comments.forEach((c) => {
      const currentComment = map.get(c.id);
      if (!currentComment) return;

      if (c.parent) {
        const parent = map.get(c.parent.id);
        if (parent) {
          parent.children.push(currentComment);
        }
      } else {
        roots.push(currentComment);
      }
    });

    return {
      comments: roots,
      count: totalCount,
    };
  }

  async removeComment(commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['article'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepository.remove(comment);

    this.articleGateway.emitDeletedComment(commentId, comment.article.id);
  }
}
