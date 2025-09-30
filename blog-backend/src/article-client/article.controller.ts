import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './commands/createArticle/dto/create-article.dto';
import { CreateArticleCommand } from './commands/createArticle/impl/create-article.command';
import { GetArticlesQuery } from './queries/getArticles/impl/get-articles.query';
import { Article } from './entities/article.entity';
import { DeleteArticleCommand } from './commands/deleteArticle/impl/delete-article.command';
import { GetArticleQuery } from './queries/getArticle/impl/get-article.query';
import { UpdateArticleDto } from './commands/editArticle/dto/update-article.dto';
import { UpdateArticleCommand } from './commands/editArticle/impl/update-article.command';
import { GetPopularArticlesQuery } from './queries/getPopularArticles/impl/get-popular-articles.query';
import { GetArticlesCreatedByClientQuery } from './queries/getArticlesCreatedByClient/impl/get-articles-created-by-client.query';
import { ArticleDto } from './queries/getArticles/dto/article.dto';
import { OrderType } from './types/orderType';
import { GetArticlesQueryDto } from './queries/getArticlesCreatedByClient/dto/get.articles.query.dto';
import { PaginatedArticlesDto } from './queries/getArticlesCreatedByClient/dto/PaginatedArticlesDto';

export interface ArticlesPage {
  articles: Article[];
  total: number;
}

@Controller('/client/articles')
export class ArticleController {
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get articles (paginated, sortable, filterable by categories)',
  })
  @ApiQuery({ name: 'skip', type: Number, required: true })
  @ApiQuery({ name: 'take', type: Number, required: true })
  @ApiQuery({ name: 'sortBy', type: String, required: false })
  @ApiQuery({ name: 'order', enum: OrderType, required: false })
  @ApiQuery({
    name: 'categories',
    type: [String],
    required: false,
    description: 'Categories array',
    example: ['tech', 'ai'],
  })
  async getArticles(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: OrderType,
    @Query('categories') categories?: string[] | string,
  ): Promise<ArticleDto[]> {
    let normalizedCategories: string[] | undefined;

    if (typeof categories === 'string') {
      normalizedCategories = [categories];
    } else if (Array.isArray(categories)) {
      normalizedCategories = categories;
    }

    return this.queryBus.execute(
      new GetArticlesQuery({
        skip,
        take,
        sortBy,
        order,
        categories: normalizedCategories,
      }),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/create')
  @ApiOperation({ summary: 'Create article with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        authorId: { type: 'string' },
        description: { type: 'string' },
        categories: {
          type: 'string',
          example: '["tech","ai"]',
          description: 'JSON category array as string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        isActive: {
          type: 'string',
        },
        readingTime: {
          type: 'string',
          description: 'Estimated reading time in minutes',
        },
        createdAt: {
          type: 'string',
          description:
            'Date and time the article was created in ISO 8601 format (e.g. 2023-10-05T14:48:00.000Z)',
        },
      },
      required: [
        'title',
        'content',
        'image',
        'authorId',
        'description',
        'isActive',
        'readingTime',
        'createdAt',
      ],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createArticle(
    @Body() body: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.commandBus.execute(new CreateArticleCommand(body, file));
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/edit')
  @ApiOperation({ summary: 'Editing an article with a image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        description: { type: 'string' },
        categories: {
          type: 'string',
          example: '["tech","ai"]',
          description: 'JSON category array as string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        isActive: {
          type: 'string',
        },
        readingTime: {
          type: 'string',
          description: 'Estimated reading time in minutes',
        },
        createdAt: {
          type: 'string',
          description:
            'Date and time the article was created in ISO 8601 format (e.g. 2023-10-05T14:48:00.000Z)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateArticle(
    @Body() body: UpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.commandBus.execute(new UpdateArticleCommand(body, file));
  }

  @Get('/popular')
  @ApiOperation({ summary: 'Get most popular articles (paginated)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getPopularArticles(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<ArticlesPage> {
    const skipNum = skip ?? 0;
    const takeNum = take ?? 4;
    return await this.queryBus.execute(
      new GetPopularArticlesQuery(skipNum, takeNum),
    );
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get articles created by user with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated articles list',
    type: PaginatedArticlesDto,
  })
  async getByAuthor(
    @Param('clientId') clientId: string,
    @Query() dto: GetArticlesQueryDto,
  ): Promise<PaginatedArticlesDto> {
    return this.queryBus.execute(
      new GetArticlesCreatedByClientQuery(clientId, dto),
    );
  }

  @Get('/:uuid')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiParam({ name: 'uuid', description: 'Article ID' })
  async getArticle(@Param('uuid') id: string): Promise<void> {
    return await this.queryBus.execute(new GetArticleQuery(id));
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete article by id' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteArticleCommand(id));
  }
}
