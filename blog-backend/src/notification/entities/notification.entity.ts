import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { NotificationType } from '../types/NotificationType';
import { Article } from '../../article-client/entities/article.entity';
import { Comment } from '../../article-client/entities/comment.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: NotificationType;

  @ManyToOne(() => Article, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  article?: Article;

  @ManyToOne(() => Comment, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  comment?: Comment;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => Client, (client) => client.notifications, {
    eager: true,
    onDelete: 'CASCADE',
  })
  recipient: Client;

  @ManyToOne(() => Client, { eager: true, onDelete: 'CASCADE' })
  actor: Client;

  @CreateDateColumn()
  createdAt: Date;
}
