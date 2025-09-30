import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_WS_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway {
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

  emitNotification(recipientId: string, notification: Notification) {
    this.server.to(`user_${recipientId}`).emit('newNotification', notification);
  }

  @SubscribeMessage('subscribeNotifications')
  async handleSubscribe(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.rooms.forEach((room) => {
      if (room.startsWith('user_') && room !== `user_${userId}`) {
        client.leave(room);
      }
    });
    const room = `user_${userId}`;
    await client.join(room);
    console.log(`Client ${client.id} joined ${room}`);
  }
}
