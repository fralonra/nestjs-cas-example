import * as fs from 'fs';
import { URL } from 'url';
import {
  Controller,
  Get, Post,
  Req, Res,
  Header, HttpCode, Query
} from '@nestjs/common';
import * as config from 'config';

@Controller()
export class RootController {
  @Get()
  root(@Res() res) {
    return res.send('Fake CAS Server');
  }

  @Get('/login')
  login(@Res() res, @Query() query) {
    return res.send(fs.readFileSync('./fake-server/login.html').toString());
  }

  @Post('/login')
  @HttpCode(303)
  loginAction(@Req() req, @Res() res) {
    const service = new URL(req.headers.referer).searchParams.get('service');
    let to = new URL(service).searchParams.get('to');
    const toUrl = new URL(to);
    if (toUrl.searchParams.has('ticket')) {
      toUrl.searchParams.delete('ticket');
      to = toUrl.href;
    }
    return res.redirect(decodeURI(`${to}?ticket=${config.casServer.ticket}`));
  }

  @Get('/logout')
  logout(@Res() res, @Query('service') service) {
    if (service) {
      return res.redirect(service);
    }
    return res.send(fs.readFileSync('./fake-server/logout.html').toString());
  }

  @Get('/p3/serviceValidate')
  serviceValide(@Res() res, @Query('ticket') ticket) {
    if (!ticket || ticket !== config.casServer.ticket) {
      return res.send('Wrong ticket!');
    }
    return res.send(fs.readFileSync('./fake-server/res.xml').toString());
  }
}
