import * as config from 'config';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  await app.listen(config.casServer.port);
}
bootstrap();
