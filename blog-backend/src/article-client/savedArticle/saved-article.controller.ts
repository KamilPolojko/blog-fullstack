import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddToSaveArticlesCommand } from './commands/addToSavedArticles/impl/add-to-save-articles.command';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DeleteFromSavedArticlesCommand } from './commands/removeFromSavedArticles/impl/delete-from-saved-articles.command';
import { GetAllSavedArticlesQuery } from './queries/gettAllSavedArticles/impl/get-all-saved-articles.query';
import { ArticleDto } from '../queries/getArticles/dto/article.dto';

@ApiTags('Saved')
@Controller('/client/saved')
export class SavedArticlesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add article to saved' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        articleId: { type: 'string' },
      },
      required: ['userId', 'articleId'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  async save(@Body() body: { userId: string; articleId: string }) {
    await this.commandBus.execute(
      new AddToSaveArticlesCommand(body.userId, body.articleId),
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove article from saved' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        articleId: { type: 'string' },
      },
      required: ['articleId', 'userId'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  async remove(@Body() body: { userId: string; articleId: string }) {
    await this.commandBus.execute(
      new DeleteFromSavedArticlesCommand(body.userId, body.articleId),
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: "Get user's saved articles (paginated)" })
  async get(
    @Param('userId') userId: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ): Promise<{ articles: ArticleDto[]; hasMore: boolean }> {
    return this.queryBus.execute(
      new GetAllSavedArticlesQuery(userId, offset, limit),
    );
  }
}
