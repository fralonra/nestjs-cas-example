import {
  NestModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { RootController } from './root.controller';
import { AuthModule } from './auth/auth.module';
import { CasMiddleWare } from './cas.middleware';

@Module({
  imports: [AuthModule],
  controllers: [RootController]
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CasMiddleWare.serviceValidate, CasMiddleWare.authenticate)
      .forRoutes('auth/login')
      .apply(CasMiddleWare.logout)
      .forRoutes('auth/logout')
      .apply(CasMiddleWare.serviceValidate, CasMiddleWare.hasAuth)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
