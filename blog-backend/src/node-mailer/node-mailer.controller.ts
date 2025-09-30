import {
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { VerifyCodeDto } from './commands/verifyCode/dto/verify-code.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ContactUsDto } from './commands/sendContactUsMessage/dto/ContactUs.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { SendContactUsMessageCommand } from './commands/sendContactUsMessage/impl/send-contact-us-message.command';
import { GetVerificationCodeCommand } from './commands/getVerificationCode/impl/get-verification-code.command';
import { VerifyCodeCommand } from './commands/verifyCode/impl/verify-code.command';
import { GetVerificationCodeDto } from './commands/getVerificationCode/dto/get-verification-code.dto';

@Controller('/client/mail')
export class NodeMailerController {
  constructor(private commandBus: CommandBus) {}

  @Post('/sendContactUsMessage')
  @ApiOperation({
    summary:
      'Sends a message to us and sends feedback to the user who wants to contact us.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        Name: { type: 'string' },
        Email: { type: 'string' },
        Subject: { type: 'string' },
        Message: { type: 'string' },
      },
      required: ['Name', 'Email', 'Subject', 'Message'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  async sendMessageToContactUs(
    @Body() contactUsDto: ContactUsDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new SendContactUsMessageCommand(contactUsDto),
    );
  }

  @Post('/sendVerificaitonCode')
  @ApiOperation({
    summary: 'Send verification code to given email',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  async getVerificationCode(
    @Body() getVerificationCodeDto: GetVerificationCodeDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new GetVerificationCodeCommand(getVerificationCodeDto),
    );
  }

  @Post('/verifyCode')
  @ApiOperation({
    summary: 'Verify given code from email.',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
  ): Promise<{ success: boolean; userId: string | null }> {
    const {
      success: isSuccess,
      userId: id,
    }: { success: boolean; userId: string | null } =
      await this.commandBus.execute(new VerifyCodeCommand(verifyCodeDto));
    return { success: isSuccess, userId: id };
  }
}
