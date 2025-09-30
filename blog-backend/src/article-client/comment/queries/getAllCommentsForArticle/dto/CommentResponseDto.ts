import { CommentDto } from './CommentDto';

export class CommentResponseDto {
  comments: CommentDto[];
  count: number;
}
