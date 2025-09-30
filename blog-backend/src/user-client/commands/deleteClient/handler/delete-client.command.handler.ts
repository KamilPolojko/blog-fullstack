import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { DeleteClientCommand } from '../impl/delete-client.command';

@CommandHandler(DeleteClientCommand)
export class DeleteClientCommandHandler
  implements ICommandHandler<DeleteClientCommand>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(command: DeleteClientCommand): Promise<void> {
    await this.clientService.remove(command.uuid);
  }
}
