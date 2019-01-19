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
    res.cookie(SID_COOKIE_NAME, '');
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
    res.cookie(ST_COOKIE_NAME, '');
    if (!st && !sid) return res.send({});
    // If using in production environment, please don't use MemoryStorage.
    // Use a session store listed in https://github.com/expressjs/session/blob/master/README.md#compatible-session-stores please.
    let session;
    if (!sid) {
      const sids = Object.keys(req.sessionStore.sessions);
      for (let i in sids) {
        const id = sids[i];
        const s = JSON.parse(req.sessionStore.sessions[id]);
        if (!s) break;
        if (s.st === st) {
          sid = id;
          session = s;
          break;
        }
      }
      if (!sid) return res.send({});
      res.cookie(SID_COOKIE_NAME, sid);
    } else {
      session = JSON.parse(req.sessionStore.sessions[sid]);
    }
    if (!session) return res.send({});
    const user = session.cas.user;

    res.cookie(SID_COOKIE_NAME, sid);
    res.cookie(ST_COOKIE_NAME, '');
    return res.send({ user });
  }
}
