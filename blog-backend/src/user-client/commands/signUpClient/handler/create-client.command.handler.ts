import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateClientCommand } from '../impl/create-client.command';
import { ClientService } from '../../../client.service';

@CommandHandler(CreateClientCommand)
export class CreateClientCommandHandler
  implements ICommandHandler<CreateClientCommand>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(
    command: CreateClientCommand,
  ): Promise<{ success: boolean; message: string }> {
    return await this.clientService.signUp(command.clientDTO);
  }
}
