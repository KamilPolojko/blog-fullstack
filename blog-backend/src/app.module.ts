import { Module } from '@nestjs/common';
import { ClientModule } from './user-client/client.module';
import { dataSourceOptions } from '../db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { ArticleModule } from './article-client/article.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    RedisModule,
    ArticleModule,
    ClientModule,
    AuthModule,
    NodeMailerModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
