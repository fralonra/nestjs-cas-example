import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.use(cookieParser(config.appServer.session.secret));
  app.use(
    session({
      secret: config.appServer.session.secret,
      name: 'sid',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(config.appServer.port);
}
bootstrap();
