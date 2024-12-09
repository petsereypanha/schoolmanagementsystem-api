import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TransformInterceptor } from 'src/modules/common/interceptor/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from 'src/modules/common/interceptor/timeout.interceptor';
import { UsersModule } from 'src//modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from 'src/modules/common/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: redisConfig,
      isGlobal: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
