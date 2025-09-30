import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Client } from './entities/client.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { GetClientsQueryHandler } from './queries/getClients/handler/get-clients.query.handler';
import { CreateClientCommandHandler } from './commands/signUpClient/handler/create-client.command.handler';
import { DeleteClientCommandHandler } from './commands/deleteClient/handler/delete-client.command.handler';
import { FillProfileClientCommandHandler } from './commands/fillProfileClient/handler/fill-profile-client.command.handler';
import { Profile } from './entities/profile.entity';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { CloudinaryProvider } from '../Cloudinary/cloudinary.provider';
import { GetCurrentLoggedClientQueryHandler } from './queries/getCurrentLoggedClient/handler/get-current-logged-client.query.handler';
import { ChangeClientEmailAddressCommandHandler } from './commands/changeClientEmailAddress/handler/change-client-email-address.command.handler';
import { ChangeClientPasswordCommandHandler } from './commands/changeClientPassword/handler/change-client-password.command.handler';
import { GetClientQueryHandler } from './queries/getClient/handler/get-client.query.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Client, Profile])],
  controllers: [ClientController],
  providers: [
    CloudinaryProvider,
    ClientService,
    CloudinaryService,
    GetClientsQueryHandler,
    GetClientQueryHandler,
    CreateClientCommandHandler,
    DeleteClientCommandHandler,
    FillProfileClientCommandHandler,
    GetCurrentLoggedClientQueryHandler,
    ChangeClientEmailAddressCommandHandler,
    ChangeClientPasswordCommandHandler,
  ],
  exports: [TypeOrmModule, ClientService, CloudinaryService],
})
export class ClientModule {}
