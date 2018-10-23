import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
