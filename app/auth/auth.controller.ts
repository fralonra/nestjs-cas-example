import {
  Controller,
  Get,
  Req, Res,
  Headers, Query, Session,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('login')
  login(@Res() res, @Query('to') to, @Session() session) {
    const ticket = session.st;
    const user = {
      user: session.cas.user,
      st: ticket,
    };
    const sessionDto = {
      sid: session.id,
      user,
      loggedInTime: new Date(),
    };
    return res.redirect(to);
  }

  @Get('logout')
  async logout(@Req() req, @Res() res, @Session() session) {
    req.sessionStore.sessions = {};
    if (!session) {
      return res.redirect('/');
    }
    if (session.destroy) {
      session.destroy();
    } else {
      session = null;
    }
    const logoutPath = req.logoutPath;
    return res.redirect(logoutPath);
  }

  @Get('user')
  user(@Req() req, @Res() res, @Headers('referer') referer) {
    const sid = Object.keys(req.sessionStore.sessions)[0];
    const session = JSON.parse(req.sessionStore.sessions[sid]);
    return res.send(session.cas);
  }
}
