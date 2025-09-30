import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from '../user-client/client.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private clientService: ClientService) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.clientService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`Invalid Email`);
    }

    const isPasswordMatched = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(`Invalid Password`);
    }

    const { password, ...rest } = user;
    return rest;
  }
}
