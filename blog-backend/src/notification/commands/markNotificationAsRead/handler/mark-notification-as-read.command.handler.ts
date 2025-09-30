import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MarkNotificationAsReadCommand } from '../impl/mark-notification-as-read.command';
import { NotificationService } from '../../../notification.service';
import { Notification } from '../../../entities/notification.entity';

@CommandHandler(MarkNotificationAsReadCommand)
export class MarkNotificationAsReadCommandHandler
  implements ICommandHandler<MarkNotificationAsReadCommand>
{
  constructor(private readonly notificationService: NotificationService) {}

  async execute(command: MarkNotificationAsReadCommand): Promise<Notification> {
    return await this.notificationService.markAsRead(
      command.notificationId,
      command.clientId,
    );
  }
}
