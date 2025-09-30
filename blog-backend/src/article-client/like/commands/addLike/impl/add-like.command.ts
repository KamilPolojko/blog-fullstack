import { LikeDTO } from '../dto/LikeDTO';

export class AddLikeCommand {
  constructor(public readonly likeDTO: LikeDTO) {}
}
