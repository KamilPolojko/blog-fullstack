// node-mailer.service.ts
import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../user-client/entities/client.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class NodeMailerService {
  private readonly logger = new Logger(NodeMailerService.name);

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly mailerService: MailerService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template?: string,
    context?: Record<string, any>,
    text?: string,
    html?: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
      text,
      html,
    });
  }

  async generateVerificationCode(
    email: string,
    length: number = 6,
  ): Promise<{ code: string; expiresAt: Date }> {
    const user = await this.clientRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const digits = [];
    for (let i = 0; i < length; i++) {
      digits.push(Math.floor(crypto.randomInt(0, 10)));
    }
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const value: string = digits.join('');
    const key = `verify_code:${value}`;

    const cacheData = JSON.stringify({
      userId: user.id,
      expiresAt: expiresAt.toISOString(),
    });

    try {
      this.logger.log(`🔄 Zapisuję do Redis: ${key}`);

      const result = await this.redis.setex(key, 300, cacheData);
      this.logger.log(`📝 Redis setex result: ${result}`);
    } catch (error) {
      this.logger.error('❌ Błąd przy zapisie do Redis:', error);
      throw new Error('Redis write failed');
    }

    return { code: value, expiresAt };
  }

  async verifyCode(
    inputCode: string,
  ): Promise<{ success: boolean; userId: string | null }> {
    const key = `verify_code:${inputCode}`;
    this.logger.log(`🔍 Szukam kodu: ${key}`);

    try {
      const dataStr = await this.redis.get(key);
      this.logger.log(`📖 Dane z Redis:`, dataStr);

      if (!dataStr) {
        this.logger.warn(`⚠️ Kod nie został znaleziony: ${key}`);
        return { success: false, userId: null };
      }

      const data: {
        userId: string;
        expiresAt: string;
      } = JSON.parse(dataStr);

      const expirationTime = new Date(data.expiresAt);
      const now = new Date();

      if (expirationTime < now) {
        this.logger.warn(`⏰ Kod wygasł: ${key}`);
        await this.redis.del(key);
        return { success: false, userId: null };
      }

      const deleted = await this.redis.del(key);
      this.logger.log(`🗑️ Kod usunięty (${deleted} kluczy): ${key}`);

      return { success: true, userId: data.userId };
    } catch (error) {
      this.logger.error('❌ Błąd przy weryfikacji kodu:', error);
      return { success: false, userId: null };
    }
  }
}
