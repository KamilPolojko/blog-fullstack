import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Comment } from './entities/comment.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_WS_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ArticleGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    socket.setMaxListeners(20);
  }

  handleDisconnect(socket: Socket) {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  }

  emitNewComment(comment: Comment) {
    this.server.to(`article_${comment.article.id}`).emit('newComment', comment);
  }

  emitDeletedComment(commentId: string, articleId: string) {
    this.server.to(`article_${articleId}`).emit('deletedComment', commentId);
  }

  emitEditedComment(comment: Comment) {
    this.server
      .to(`article_${comment.article.id}`)
      .emit('editedComment', comment);
  }

  emitCommentLiked(
    commentId: string,
    articleId: string,
    userId: string,
    likesCount: number,
  ) {
    this.server.to(`article_${articleId}`).emit('commentLiked', {
      commentId,
      userId,
      likesCount,
    });
  }

  emitCommentUnliked(
    commentId: string,
    articleId: string,
    userId: string,
    likesCount: number,
  ) {
    this.server.to(`article_${articleId}`).emit('commentUnliked', {
      commentId,
      userId,
      likesCount,
    });
  }

  emitArticleLiked(articleId: string, userId: string, likesCount: number) {
    this.server.to(`article_${articleId}`).emit('articleLiked', {
      articleId,
      userId,
      likesCount,
    });
  }

  emitArticleUnliked(articleId: string, userId: string, likesCount: number) {
    this.server.to(`article_${articleId}`).emit('articleUnliked', {
      articleId,
      userId,
      likesCount,
    });
  }

  @SubscribeMessage('subscribeArticle')
  async handleSubscribe(
    @MessageBody() articleId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.rooms.forEach((room) => {
      if (room.startsWith('article_') && room !== `article_${articleId}`) {
        client.leave(room);
      }
    });

    const room = `article_${articleId}`;
    await client.join(room);
    console.log(`Client ${client.id} joined ${room}`);
  }
}
