import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { AddLikeCommandHandler } from './commands/addLike/handler/add-like.command.handler';
import { DeleteLikeCommandHandler } from './commands/deleteLike/handler/delete-like.command.handler';
import { GetAllLikesQueryHandler } from './queries/getAllLikes/handler/get-all-likes.query.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { Article } from '../entities/article.entity';
import { Like } from '../entities/like.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { NotificationService } from '../../notification/notification.service';
import { NotificationGateway } from '../../notification/notification.gateway';
import { ArticleGateway } from '../articles.gateway';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Client, Article, Like, Notification]),
  ],
  controllers: [LikeController],
  providers: [
    LikeService,
    NotificationService,
    NotificationGateway,
    ArticleGateway,
    AddLikeCommandHandler,
    DeleteLikeCommandHandler,
    GetAllLikesQueryHandler,
  ],
  exports: [LikeService],
})
export class LikeModule {}
