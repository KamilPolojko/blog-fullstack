import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { FillProfileClientCommand } from '../impl/fill-profile-client.command';
import { Profile } from '../../../entities/profile.entity';

@CommandHandler(FillProfileClientCommand)
export class FillProfileClientCommandHandler
  implements ICommandHandler<FillProfileClientCommand>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(command: FillProfileClientCommand): Promise<Profile> {
    return await this.clientService.fillProfile(
      command.fillProfileDTO,
      command.file,
    );
  }
}
