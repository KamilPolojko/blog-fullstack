import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodeMailerController } from './node-mailer.controller';
import { SendContactUsMessageCommandHandler } from './commands/sendContactUsMessage/handler/send-contact-us-message.command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetVerificationCodeCommandHandler } from './commands/getVerificationCode/handler/get-verification-code.command.handler';
import { VerifyCodeCommandHandler } from './commands/verifyCode/handler/verify-code.command.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../user-client/entities/client.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Client]),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_SERVICE_MESSAGE_SENDER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [NodeMailerController],
  providers: [
    NodeMailerService,
    SendContactUsMessageCommandHandler,
    GetVerificationCodeCommandHandler,
    VerifyCodeCommandHandler,
  ],
  exports: [NodeMailerService],
})
export class NodeMailerModule {}
