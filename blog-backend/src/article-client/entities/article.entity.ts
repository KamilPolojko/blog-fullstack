import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../user-client/entities/client.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity('articles')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Client, (client) => client.articles, { onDelete: 'CASCADE' })
  @JoinColumn()
  author: Client;

  @Column('text')
  linkIImage: string;

  @Column({ nullable: true })
  cloudinaryPublicId: string;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.article)
  likes: Like[];

  @Column({ type: 'jsonb', nullable: true })
  categories: string[];

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', default: 5 })
  readingTime: number;

  @ManyToMany(() => Client, (client) => client.savedArticles)
  savedBy: Client[];

  @Column({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;
}
