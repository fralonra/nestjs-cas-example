import {
  Controller,
  Get,
  Req, Res,
  Headers, Query, Session,
} from '@nestjs/common';

const SID_COOKIE_NAME = 'SID';
const ST_COOKIE_NAME = 'CAS_ST';

@Controller('auth')
export class AuthController {
  @Get('login')
  login(@Res() res, @Query('to') to, @Session() session) {
    const st = session.st;
    const user = {
      username: session.cas.user,
    };
    res.cookie(ST_COOKIE_NAME, st);
    return res.redirect(to);
  }

  @Get('logout')
  async logout(@Req() req, @Res() res, @Session() session) {
    if (!session) {
      return res.redirect('/');
    }
    if (session.destroy) {
      session.destroy();
    } else {
      session = null;
    }
    res.cookie(ST_COOKIE_NAME, '');
    res.cookie(SID_COOKIE_NAME, '');
    return res.redirect(req.logoutPath);
  }

  @Get('user')
  user(@Req() req, @Res() res, @Headers('referer') referer, @Query('st') st) {
    let sid = req.cookies[SID_COOKIE_NAME];
    if (!st && !sid) return res.send({});
    if (!sid) {
      const sids = Object.keys(req.sessionStore.sessions);
      for (let i in sids) {
        const id = sids[i];
        const session = JSON.parse(req.sessionStore.sessions[id]);
        if (!session) break;
        if (session.st === st) {
          sid = id;
          break;
        }
      }
      if (!sid) return res.send({});
      res.cookie(SID_COOKIE_NAME, sid);
    }
    const session = JSON.parse(req.sessionStore.sessions[sid]);
    if (!session) return res.send({});
    const username = session.cas.user;

    res.cookie(ST_COOKIE_NAME, '');
    return res.send(username);
  }
}
