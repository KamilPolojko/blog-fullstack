import { ContactUsDto } from '../dto/ContactUs.dto';

export class SendContactUsMessageCommand {
  constructor(public readonly contactUsDto: ContactUsDto) {}
}
