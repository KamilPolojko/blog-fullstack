import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentLikesService } from './comment.likes.service';
import { RequestWithUser } from '../../../user-client/client.controller';
import { AuthenticatedGuard } from '../../../auth/authenticated.guard';
import { ApiOperation } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ToggleLikeCommand } from './commands/toggleLike/impl/toggle-like.command';
import { GetCommentLikesCountQuery } from './queries/getCommentLikesCount/impl/get-comment-likes-count.query';
import { IsLikedByCurrentLoggedUserQuery } from './queries/isLikedByCurrentLoggedUser/impl/is-liked-by-current-logged-user.query';

@Controller('/client/commentLikes')
export class CommentLikesController {
  constructor(
    private readonly commentLikesService: CommentLikesService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Add and remove like to comment (toggle behaviour)',
  })
  @Post('/toggle/:commentId')
  async toggleLike(
    @Param('commentId') commentId: string,
    @Req() request: RequestWithUser,
  ): Promise<{ liked: boolean }> {
    return await this.commandBus.execute(
      new ToggleLikeCommand(commentId, request.user.id),
    );
  }

  @Get('/count/:commentId')
  @ApiOperation({ summary: 'Add comment to article' })
  async getCount(
    @Param('commentId') commentId: string,
  ): Promise<{ count: number }> {
    const likesCount: number = await this.queryBus.execute(
      new GetCommentLikesCountQuery(commentId),
    );
    return { count: likesCount };
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Checks if chosen comment is liked by current logged user',
  })
  @Get('/me/:commentId')
  async isLikedByMe(
    @Param('commentId') commentId: string,
    @Req() request: RequestWithUser,
  ) {
    const isLiked: boolean = await this.queryBus.execute(
      new IsLikedByCurrentLoggedUserQuery(commentId, request.user.id),
    );
    return {
      liked: isLiked,
    };
  }
}
