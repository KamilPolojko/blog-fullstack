import { GetVerificationCodeDto } from '../dto/get-verification-code.dto';

export class GetVerificationCodeCommand {
  constructor(public readonly getVerificationCodeDto: GetVerificationCodeDto) {}
}
