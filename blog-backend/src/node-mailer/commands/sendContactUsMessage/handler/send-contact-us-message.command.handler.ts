import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendContactUsMessageCommand } from '../impl/send-contact-us-message.command';
import { NodeMailerService } from '../../../node-mailer.service';

@CommandHandler(SendContactUsMessageCommand)
export class SendContactUsMessageCommandHandler
  implements ICommandHandler<SendContactUsMessageCommand>
{
  constructor(private readonly mailerService: NodeMailerService) {}

  async execute(command: SendContactUsMessageCommand): Promise<void> {
    const { Name, Email, Subject, Message } = command.contactUsDto;

    await this.mailerService.sendEmail(
      process.env.WEBSITE_EMAIL!,
      `Nowa wiadomość z formularza kontaktowego: ${Subject}`,
      undefined,
      undefined,
      `Od: ${Name} <${Email}>\n\n${Message}`,
      `<p><strong>Od:</strong> ${Name} &lt;${Email}&gt;</p>
       <p><strong>Temat:</strong> ${Subject}</p>
       <p><strong>Treść wiadomości:</strong></p>
       <p>${Message}</p>`,
    );

    await this.mailerService.sendEmail(
      Email,
      'Potwierdzenie otrzymania wiadomości',
      undefined,
      undefined,
      `Otrzymaliśmy od Ciebie wiadomość o treści:\n"${Message}"\nOdpowiemy maksymalnie w ciągu dwóch dni.`,
      `<p>Otrzymaliśmy od Ciebie wiadomość o treści:</p>
       <blockquote>${Message}</blockquote>
       <p>Odpowiemy na nią maksymalnie w ciągu <strong>dwóch dni roboczych</strong>.</p>
       <p>Pozdrawiamy,</p>
       <p>Zespół obsługi klienta Notabene.</p>`,
    );
  }
}
