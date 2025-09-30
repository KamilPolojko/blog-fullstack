import { Like } from '../../../../entities/like.entity';

export class AllLikesDTO {
  likes: Like[];
  count: number;
}
