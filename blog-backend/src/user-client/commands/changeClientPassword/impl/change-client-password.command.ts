import { changePasswordDTO } from '../dto/change-password.dto';

export class ChangeClientPasswordCommand {
  constructor(public readonly changePasswordDTO: changePasswordDTO) {}
}
