import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetClientsQuery } from './queries/getClients/impl/get-clients.query';
import { CreateClientCommand } from './commands/signUpClient/impl/create-client.command';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { DeleteClientCommand } from './commands/deleteClient/impl/delete-client.command';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Client } from './entities/client.entity';
import { signUpClientDTO } from './commands/signUpClient/dto/signUp-client.dto';
import { fillUpProfileDTO } from './commands/fillProfileClient/dto/fill-profile.dto';
import { FillProfileClientCommand } from './commands/fillProfileClient/impl/fill-profile-client.command';
import { Gender } from './types/gender';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentLoggedClientQuery } from './queries/getCurrentLoggedClient/impl/get-current-logged-client.query';
import { ChangeClientEmailAddressCommand } from './commands/changeClientEmailAddress/impl/change-client-email-address.command';
import { changeEmailDTO } from './commands/changeClientEmailAddress/dto/change-email.dto';
import { changePasswordDTO } from './commands/changeClientPassword/dto/change-password.dto';
import { ChangeClientPasswordCommand } from './commands/changeClientPassword/impl/change-client-password.command';
import { ClientDto } from './queries/getCurrentLoggedClient/dto/ClientDTO';
import { GetClientQuery } from './queries/getClient/impl/get-client.query';

export type RequestWithUser = Request & { user: Client };

@Controller('/client')
export class ClientController {
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get('/clients')
  @ApiOperation({
    summary: 'Get all clients',
  })
  async getAllClients(): Promise<Client[]> {
    return await this.queryBus.execute(new GetClientsQuery());
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Get user after success login',
  })
  @Get('/me')
  async getMe(@Req() request: RequestWithUser): Promise<ClientDto | null> {
    return await this.queryBus.execute(
      new GetCurrentLoggedClientQuery(request.user.id),
    );
  }

  @Post('/register')
  @ApiOperation({
    summary: "Creating user's account",
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  async signup(
    @Body(new ValidationPipe({ transform: true })) dto: signUpClientDTO,
  ): Promise<{ success: boolean; message: string }> {
    return await this.commandBus.execute(new CreateClientCommand(dto));
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/fill-profile')
  @ApiOperation({
    summary: "Fill user's profile",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        gender: {
          type: 'string',
          enum: Object.values(Gender),
        },
        dateOfBirth: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async fillProfile(
    @Body(new ValidationPipe({ transform: true })) dto: fillUpProfileDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.commandBus.execute(new FillProfileClientCommand(dto, file));
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/change-email')
  @ApiOperation({
    summary: 'Changes user e-mail',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        newEmail: { type: 'string' },
        repeatNewEmail: { type: 'string' },
      },
      required: ['email', 'newEmail', 'repeatNewEmail'],
    },
  })
  async changeEmail(
    @Body(new ValidationPipe({ transform: true })) dto: changeEmailDTO,
  ) {
    await this.commandBus.execute(new ChangeClientEmailAddressCommand(dto));
  }

  @Patch('/change-password')
  @ApiOperation({
    summary: 'Changes user password',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        newPassword: { type: 'string' },
        repeatNewPassword: { type: 'string' },
      },
      required: ['userId', 'newPassword', 'repeatNewPassword'],
    },
  })
  async changePassword(
    @Body(new ValidationPipe({ transform: true })) dto: changePasswordDTO,
  ): Promise<{ success: boolean; message: string }> {
    return await this.commandBus.execute(new ChangeClientPasswordCommand(dto));
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/clients/:uuid')
  @ApiOperation({
    summary: 'Remove client account',
  })
  async deleteClient(@Param('uuid') uuid: string) {
    await this.commandBus.execute(new DeleteClientCommand(uuid));
  }

  @Get('/client-profile/:uuid')
  @ApiOperation({
    summary: 'Get user with profile',
  })
  async getClient(@Param('uuid') uuid: string): Promise<Client> {
    return await this.queryBus.execute(new GetClientQuery(uuid));
  }
}
