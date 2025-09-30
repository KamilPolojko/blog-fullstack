import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Client } from '../../user-client/entities/client.entity';

@Entity('likes')
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Article, (article) => article.likes, { onDelete: 'CASCADE' })
  article: Article;

  @ManyToOne(() => Client, (client) => client.likes, { onDelete: 'CASCADE' })
  user: Client;

  @CreateDateColumn()
  createdAt: Date;
}
