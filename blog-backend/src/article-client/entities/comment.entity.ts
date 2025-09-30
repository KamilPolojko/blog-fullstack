import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Client } from '../../user-client/entities/client.entity';
import { CommentLike } from './comment.like.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @ManyToOne(() => Client, (client) => client.comments, { onDelete: 'CASCADE' })
  author: Client;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CommentLike, (like) => like.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likes: CommentLike[];
}
