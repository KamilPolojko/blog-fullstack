import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { signInClientDTO } from '../user-client/queries/singInClient/dto/signIn-client.dto';
import { Session } from 'express-session';
import { Response } from 'express';

interface SessionRequest extends Request {
  session: Session & {
    userId?: string;
  };
}

@Controller('/client/auth')
export class AuthController {
  constructor() {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Logs the user in' })
  @Post('/login')
  @ApiConsumes('application/x-www-form-urlencoded')
  signIn(@Body() dto: signInClientDTO) {
    return 'You have successfully logged in.';
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logs the user out' })
  logout(@Req() req: Request, @Res() res: Response) {
    const sessionReq = req as SessionRequest;

    sessionReq.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  }
}
