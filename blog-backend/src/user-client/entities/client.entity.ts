import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Article } from '../../article-client/entities/article.entity';
import { Comment } from '../../article-client/entities/comment.entity';
import { Like } from '../../article-client/entities/like.entity';
import { CommentLike } from '../../article-client/entities/comment.like.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.client, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => Article, (article) => article.savedBy)
  @JoinTable({
    name: 'saved_articles',
    joinColumn: { name: 'client_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'article_id', referencedColumnName: 'id' },
  })
  savedArticles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => CommentLike, (like) => like.user)
  commentLikes: CommentLike[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];
}
