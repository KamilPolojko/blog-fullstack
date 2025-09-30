import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Article } from './entities/article.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { CreateArticleCommandHandler } from './commands/createArticle/handler/create-article.command.handler';
import { Client } from '../user-client/entities/client.entity';
import { GetArticlesQueryHandler } from './queries/getArticles/handler/get-articles.query.handler';
import { DeleteArticleCommandHandler } from './commands/deleteArticle/handler/delete-article.command.handler';
import { CloudinaryProvider } from '../Cloudinary/cloudinary.provider';
import { AddToSaveArticlesCommandHandler } from './savedArticle/commands/addToSavedArticles/handler/add-to-save-articles.command.handler';
import { SavedArticlesController } from './savedArticle/saved-article.controller';
import { SavedArticleService } from './savedArticle/saved-article.service';
import { GetAllSavedArticlesQueryHandler } from './savedArticle/queries/gettAllSavedArticles/handler/get-all-saved-articles.query.handler';
import { DeleteFromSavedArticlesCommandHandler } from './savedArticle/commands/removeFromSavedArticles/handler/delete-from-saved-articles.command.handler';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { GetArticleQueryHandler } from './queries/getArticle/handler/get-article.query.handler';
import { UpdateArticleCommandHandler } from './commands/editArticle/handler/update-article.command.handler';
import { GetPopularArticlesQueryHandler } from './queries/getPopularArticles/handler/get-popular-articles.query.handler';
import { ArticleGateway } from './articles.gateway';
import { GetArticlesCreatedByClientQueryHandler } from './queries/getArticlesCreatedByClient/handler/get-articles-created-by-client.query.handler';
import { CommentLike } from './entities/comment.like.entity';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationGateway } from '../notification/notification.gateway';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    CqrsModule,
    LikeModule,
    CommentModule,
    TypeOrmModule.forFeature([
      Client,
      Article,
      Comment,
      Like,
      CommentLike,
      Notification,
    ]),
  ],
  controllers: [ArticleController, SavedArticlesController],
  providers: [
    CloudinaryProvider,
    ArticleService,
    CloudinaryService,
    SavedArticleService,
    NotificationService,
    NotificationGateway,
    ArticleGateway,
    CreateArticleCommandHandler,
    UpdateArticleCommandHandler,
    GetArticlesQueryHandler,
    GetPopularArticlesQueryHandler,
    GetArticlesCreatedByClientQueryHandler,
    GetArticleQueryHandler,
    DeleteArticleCommandHandler,
    AddToSaveArticlesCommandHandler,
    DeleteFromSavedArticlesCommandHandler,
    GetAllSavedArticlesQueryHandler,
  ],
  exports: [
    TypeOrmModule,
    ArticleService,
    SavedArticleService,
    NotificationService,
    CloudinaryService,
    ArticleGateway,
    NotificationGateway,
  ],
})
export class ArticleModule {}
