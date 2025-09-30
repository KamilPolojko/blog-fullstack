import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { Notification } from './entities/notification.entity';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { CloudinaryProvider } from '../Cloudinary/cloudinary.provider';
import { NotificationCleanupService } from './notification.cleanup.service';
import { ClientModule } from '../user-client/client.module';
import { GetClientNotificationsQueryHandler } from './queries/getUserNotifications/handler/get-client-notifications.query.handler';
import { MarkNotificationAsReadCommandHandler } from './commands/markNotificationAsRead/handler/mark-notification-as-read.command.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Notification]),
    forwardRef(() => ClientModule),
  ],
  controllers: [NotificationController],
  providers: [
    CloudinaryProvider,
    NotificationService,
    NotificationCleanupService,
    NotificationGateway,
    CloudinaryService,
    GetClientNotificationsQueryHandler,
    MarkNotificationAsReadCommandHandler,
  ],
  exports: [
    TypeOrmModule,
    NotificationService,
    NotificationCleanupService,
    NotificationGateway,
    CloudinaryService,
  ],
})
export class NotificationModule {}
