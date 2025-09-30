import { Client } from '../../../../user-client/entities/client.entity';
import { Like } from '../../../entities/like.entity';
import { Comment } from '../../../entities/comment.entity';

export class ArticleDto {
  id: string;
  title: string;
  content: string;
  description: string;
  author: Client;
  linkIImage: string;
  cloudinaryPublicId: string;
  comments?: Comment[];
  likes?: Like[];
  categories: string[];
  savedByCount: number;
  isActive: boolean;
  readingTime: number;
  createdAt: Date;
}
