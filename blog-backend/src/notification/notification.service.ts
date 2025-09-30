import { forwardRef, Inject } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Client } from '../user-client/entities/client.entity';
import { NotificationType } from './types/NotificationType';
import { Article } from '../article-client/entities/article.entity';
import { Comment } from '../article-client/entities/comment.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    recipientId: string,
    actorId: string,
    type: NotificationType,
    article?: Article,
    comment?: Comment,
  ): Promise<Notification> {
    const recipient = await this.clientRepository.findOneBy({
      id: recipientId,
    });
    const actor = await this.clientRepository.findOneBy({ id: actorId });

    if (!recipient || !actor) {
      throw new NotFoundException('Recipient or actor not found');
    }

    const notification = this.notificationRepository.create({
      recipient,
      actor,
      type,
      article,
      comment,
      isRead: false,
    });

    const saved = await this.notificationRepository.save(notification);

    this.notificationGateway.emitNotification(recipientId, saved);

    return saved;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      relations: ['actor.profile', 'article', 'comment'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }
}
