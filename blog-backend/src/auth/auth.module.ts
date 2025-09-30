import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthService } from './auth.service';
import { ClientModule } from '../user-client/client.module';
import { ClientService } from '../user-client/client.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionSerializer } from './session.serializer';

dotenv.config();

@Module({
  imports: [
    ClientModule,
    CqrsModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
