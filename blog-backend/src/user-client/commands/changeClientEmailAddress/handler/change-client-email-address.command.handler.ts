import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { ChangeClientEmailAddressCommand } from '../impl/change-client-email-address.command';

@CommandHandler(ChangeClientEmailAddressCommand)
export class ChangeClientEmailAddressCommandHandler
  implements ICommandHandler<ChangeClientEmailAddressCommand>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(command: ChangeClientEmailAddressCommand): Promise<void> {
    await this.clientService.changeClientEmailAddress(command.changeMailDTO);
  }
}
