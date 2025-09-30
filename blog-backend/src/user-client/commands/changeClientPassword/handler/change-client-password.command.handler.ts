import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { ChangeClientPasswordCommand } from '../impl/change-client-password.command';

@CommandHandler(ChangeClientPasswordCommand)
export class ChangeClientPasswordCommandHandler
  implements ICommandHandler<ChangeClientPasswordCommand>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(
    command: ChangeClientPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    return await this.clientService.changePassword(command.changePasswordDTO);
  }
}
