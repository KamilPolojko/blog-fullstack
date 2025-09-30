import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetClientNotificationsQuery } from '../impl/get-client-notifications.query';
import { NotificationService } from '../../../notification.service';
import { Notification } from '../../../entities/notification.entity';

@QueryHandler(GetClientNotificationsQuery)
export class GetClientNotificationsQueryHandler
  implements IQueryHandler<GetClientNotificationsQuery>
{
  constructor(private readonly notificationService: NotificationService) {}

  async execute(query: GetClientNotificationsQuery): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(query.clientId);
  }
}
