import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationCleanupService {
  private readonly logger = new Logger(NotificationCleanupService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCleanup() {
    this.logger.log('Starting notifications cleanup...');

    const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deleteResult = await this.notificationRepository.delete({
      isRead: true,
      createdAt: LessThan(THIRTY_DAYS_AGO),
    });

    this.logger.log(
      `Deleted ${deleteResult.affected} read notifications older than 30 days.`,
    );

    const users = await this.notificationRepository
      .createQueryBuilder('n')
      .select('n.recipientId')
      .distinct(true)
      .getRawMany<{ recipientId: string }>();

    for (const { recipientId } of users) {
      const oldNotifications = await this.notificationRepository.find({
        where: { recipient: { id: recipientId } },
        order: { createdAt: 'DESC' },
        skip: 20,
      });

      if (oldNotifications.length > 0) {
        await this.notificationRepository.remove(oldNotifications);
        this.logger.log(
          `Removed ${oldNotifications.length} old notifications for user ${recipientId}`,
        );
      }
    }

    this.logger.log('Notifications cleanup finished.');
  }
}
