import { URL } from 'url';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import * as config from 'config';
const cas = require('connect-cas');

cas.configure(config.cas);

export const CasMiddleWare = {
  hasAuth(req, res, next) {
    const excludePaths = ['auth/login'];
    const isInclude = excludePaths.every(p => req.baseUrl.indexOf(p) === -1);
    if (isInclude && Object.keys(req.sessionStore.sessions).length < 1) {
      const redirectUrl = req.headers.referer || `${req.protocol}://${req.headers.host}${req.url}`;
      return res.redirect(`/auth/login?to=${redirectUrl}`);
    }
    next();
  },

  serviceValidate(req, res, next) {
    cas.serviceValidate()(req, res, next);
  },

  authenticate(req, res, next) {
    cas.authenticate()(req, res, next);
  },

  async logout(req, res, next) {
    const config = cas.configure();
    const logoutPath = `${config.protocol}://${config.host}/${config.paths.logout}`;
    let referer = req.headers.referer || '';
    const refererUrl = new URL(referer);
    if (refererUrl.searchParams.has('ticket')) {
      refererUrl.searchParams.delete('ticket');
      referer = refererUrl.href;
    }
    req.logoutPath = `${logoutPath}?service=${referer}`;
    next();
  },
};
