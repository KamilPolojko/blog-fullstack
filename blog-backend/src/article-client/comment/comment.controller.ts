import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddCommentCommand } from './commands/addComment/impl/add-comment.command';
import { DeleteCommentCommand } from './commands/deleteComment/impl/delete-comment.command';
import { GetAllCommentsForArticleQuery } from './queries/getAllCommentsForArticle/impl/get-all-comments-for-article.query';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Comment } from '../entities/comment.entity';
import { EditCommentCommand } from './commands/editComment/impl/edit-comment.command';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { AddCommentDTO } from './commands/addComment/dto/AddCommentDTO';

@ApiTags('Comments')
@Controller('/client/comments')
export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  @ApiOperation({ summary: 'Add comment to article' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'string' },
        userId: { type: 'string' },
        content: { type: 'string' },
        parentId: { type: 'string', nullable: true },
      },
      required: ['articleId', 'userId', 'content'],
    },
  })
  async addComment(
    @Body()
    body: AddCommentDTO,
  ): Promise<void> {
    return this.commandBus.execute(new AddCommentCommand(body));
  }

  @UseGuards(AuthenticatedGuard)
  @Put()
  @ApiOperation({ summary: 'Edit comment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commentId: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['commentId', 'content'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  async editComment(
    @Body() body: { commentId: string; content: string },
  ): Promise<void> {
    return this.commandBus.execute(
      new EditCommentCommand(body.commentId, body.content),
    );
  }

  @Get(':articleId')
  @ApiOperation({ summary: 'Get all comments for article' })
  async getComments(@Param('articleId') articleId: string): Promise<Comment[]> {
    return this.queryBus.execute(new GetAllCommentsForArticleQuery(articleId));
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove comment from article' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteCommentCommand(id));
  }
}
