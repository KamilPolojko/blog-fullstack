import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddLikeCommand } from './commands/addLike/impl/add-like.command';
import { DeleteLikeCommand } from './commands/deleteLike/impl/delete-like.command';
import { GetAllLikesQuery } from './queries/getAllLikes/impl/get-all-likes.query';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AllLikesDTO } from './queries/getAllLikes/dto/AllLikesDto';

@ApiTags('Likes')
@Controller('/client/likes')
export class LikeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add like to article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'string' },
        userId: { type: 'string' },
      },
      required: ['articleId', 'userId'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  async addLike(
    @Body() body: { articleId: string; userId: string },
  ): Promise<void> {
    return await this.commandBus.execute(new AddLikeCommand(body));
  }

  @Delete()
  @ApiOperation({ summary: 'Remove like from article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'string' },
        userId: { type: 'string' },
      },
      required: ['articleId', 'userId'],
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileFieldsInterceptor([]))
  async deleteLikeByUser(
    @Body() body: { articleId: string; userId: string },
  ): Promise<void> {
    return await this.commandBus.execute(
      new DeleteLikeCommand(body.articleId, body.userId),
    );
  }

  @Get(':articleId')
  @ApiOperation({ summary: 'Get all likes for article' })
  async getLikes(@Param('articleId') articleId: string): Promise<AllLikesDTO> {
    return await this.queryBus.execute(new GetAllLikesQuery(articleId));
  }
}
