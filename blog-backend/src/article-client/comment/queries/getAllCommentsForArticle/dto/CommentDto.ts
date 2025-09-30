import { Client } from '../../../../../user-client/entities/client.entity';

export class CommentDto {
  id: string;
  content: string;
  createdAt: string;
  children: CommentDto[];
  author: Client;
}
