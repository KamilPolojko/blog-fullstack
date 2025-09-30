import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeMailerService } from '../../../node-mailer.service';
import { GetVerificationCodeCommand } from '../impl/get-verification-code.command';

@CommandHandler(GetVerificationCodeCommand)
export class GetVerificationCodeCommandHandler
  implements ICommandHandler<GetVerificationCodeCommand>
{
  constructor(private readonly mailerService: NodeMailerService) {}

  async execute(command: GetVerificationCodeCommand): Promise<void> {
    const { code, expiresAt } =
      await this.mailerService.generateVerificationCode(
        command.getVerificationCodeDto.email,
      );
    const now = new Date();
    const minutesUntilExpiration = Math.ceil(
      (expiresAt.getTime() - now.getTime()) / 60000,
    );
    return await this.mailerService.sendEmail(
      command.getVerificationCodeDto.email,
      'Verification Code',
      'verification-code',
      { code: code },
      `Your verification code is ${code}.`,
      `<p>Your verification code is <strong>${code}</strong>.</p>
       <p>This code is valid for <strong>${minutesUntilExpiration} minutes</strong> 
       until <strong>${expiresAt.toLocaleTimeString()}</strong>.</p>\``,
    );
  }
}
