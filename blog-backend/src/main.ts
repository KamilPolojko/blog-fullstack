import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClientModule } from './user-client/client.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { AuthModule } from './auth/auth.module';
import * as passport from 'passport';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { ArticleModule } from './article-client/article.module';
import { NotificationModule } from './notification/notification.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [process.env.FRONTEND_WS_URL],
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const clientConfig = new DocumentBuilder()
    .setTitle('Clothes shop for client')
    .setDescription('Clothes Shop API for clients')
    .setVersion('1.0')
    .addTag('Client')
    .build();

  const clientDocument = SwaggerModule.createDocument(app, clientConfig, {
    include: [
      ClientModule,
      AuthModule,
      NodeMailerModule,
      ArticleModule,
      NotificationModule,
    ],
  });

  SwaggerModule.setup('api/docs/client', app, clientDocument);

  const adminConfig = new DocumentBuilder()
    .setTitle('Clothes shop for admin')
    .setDescription('Clothes Shop API for admin')
    .setVersion('1.0')
    .addTag('Admin')
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AppModule],
  });

  SwaggerModule.setup('api/docs/admin', app, adminDocument);

  await app.listen(3000);
}
bootstrap();
