import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { Comment } from './comment.entity';

@Entity('comment_likes')
export class CommentLike extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => Client, (client) => client.commentLikes, {
    onDelete: 'CASCADE',
  })
  user: Client;

  @CreateDateColumn()
  createdAt: Date;
}
