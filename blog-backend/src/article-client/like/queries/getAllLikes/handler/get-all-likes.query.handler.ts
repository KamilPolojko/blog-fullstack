import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeService } from '../../../like.service';
import { GetAllLikesQuery } from '../impl/get-all-likes.query';
import { AllLikesDTO } from '../dto/AllLikesDto';

@QueryHandler(GetAllLikesQuery)
export class GetAllLikesQueryHandler
  implements IQueryHandler<GetAllLikesQuery>
{
  constructor(private readonly likeService: LikeService) {}

  async execute(command: GetAllLikesQuery): Promise<AllLikesDTO> {
    return await this.likeService.getAllLikesForArticle(command.articleId);
  }
}
