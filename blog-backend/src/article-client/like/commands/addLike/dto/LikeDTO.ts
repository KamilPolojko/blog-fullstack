import { ApiProperty } from '@nestjs/swagger';

export class LikeDTO {
  @ApiProperty({ example: 'uuid' })
  articleId: string;

  @ApiProperty({ example: 'uuid' })
  userId: string;
}
