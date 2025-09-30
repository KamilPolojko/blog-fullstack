import { signUpClientDTO } from '../dto/signUp-client.dto';

export class CreateClientCommand {
  constructor(public readonly clientDTO: signUpClientDTO) {}
}
