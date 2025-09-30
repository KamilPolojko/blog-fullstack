import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';
import { CommentLike } from '../entities/comment.like.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { NotificationService } from '../../notification/notification.service';
import { NotificationGateway } from '../../notification/notification.gateway';
import { ArticleGateway } from '../articles.gateway';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AddCommentCommandHandler } from './commands/addComment/handler/add-comment.command.handler';
import { DeleteCommentCommandHandler } from './commands/deleteComment/handler/delete-comment.command.handler';
import { EditCommentCommandHandler } from './commands/editComment/handler/edit-comment.command.handler';
import { GetAllCommentsForArticleQueryHandler } from './queries/getAllCommentsForArticle/handler/get-all-comments-for-article.query.handler';
import { CommentLikesService } from './comment-likes/comment.likes.service';
import { CommentLikesController } from './comment-likes/comment.likes.controller';
import { ToggleLikeCommandHandler } from './comment-likes/commands/toggleLike/handler/toggle-like.command.handler';
import { GetCommentLikesCountQueryHandler } from './comment-likes/queries/getCommentLikesCount/handler/get-comment-likes-count.query.handler';
import { IsLikedByCurrentLoggedUserQueryHandler } from './comment-likes/queries/isLikedByCurrentLoggedUser/handler/is-liked-by-current-logged-user.query.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Client,
      Article,
      Comment,
      CommentLike,
      Notification,
    ]),
  ],
  controllers: [CommentController, CommentLikesController],
  providers: [
    CommentService,
    CommentLikesService,
    NotificationService,
    NotificationGateway,
    ArticleGateway,
    AddCommentCommandHandler,
    DeleteCommentCommandHandler,
    EditCommentCommandHandler,
    GetAllCommentsForArticleQueryHandler,
    ToggleLikeCommandHandler,
    GetCommentLikesCountQueryHandler,
    IsLikedByCurrentLoggedUserQueryHandler,
  ],
  exports: [CommentService, CommentLikesService],
})
export class CommentModule {}
