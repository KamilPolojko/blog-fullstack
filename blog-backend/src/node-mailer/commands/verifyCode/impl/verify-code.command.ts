import { VerifyCodeDto } from '../dto/verify-code.dto';

export class VerifyCodeCommand {
  constructor(public readonly verifyCodeDto: VerifyCodeDto) {}
}
