import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeMailerService } from '../../../node-mailer.service';

import { VerifyCodeCommand } from '../impl/verify-code.command';

@CommandHandler(VerifyCodeCommand)
export class VerifyCodeCommandHandler
  implements ICommandHandler<VerifyCodeCommand>
{
  constructor(private readonly mailerService: NodeMailerService) {}

  async execute(
    command: VerifyCodeCommand,
  ): Promise<{ success: boolean; userId: string | null }> {
    const result = this.mailerService.verifyCode(command.verifyCodeDto.code);
    return Promise.resolve(result);
  }
}
