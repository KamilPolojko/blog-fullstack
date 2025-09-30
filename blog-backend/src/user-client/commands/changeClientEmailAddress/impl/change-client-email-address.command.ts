import { changeEmailDTO } from '../dto/change-email.dto';

export class ChangeClientEmailAddressCommand {
  constructor(public readonly changeMailDTO: changeEmailDTO) {}
}
