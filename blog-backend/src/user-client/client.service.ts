import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { signUpClientDTO } from './commands/signUpClient/dto/signUp-client.dto';
import { fillUpProfileDTO } from './commands/fillProfileClient/dto/fill-profile.dto';
import { Profile } from './entities/profile.entity';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { changePasswordDTO } from './commands/changeClientPassword/dto/change-password.dto';
import { changeEmailDTO } from './commands/changeClientEmailAddress/dto/change-email.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: ['profile', 'articles'],
    });
  }

  async findFullUserById(id: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async findOneById(id: string): Promise<Client | null> {
    return await this.clientRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<Client | null> {
    return await this.clientRepository.findOneBy({ email });
  }

  async signUp(dto: signUpClientDTO) {
    if (dto.password !== dto.passwordRepeat) {
      throw new BadRequestException('Passwords are not the same');
    }

    const { password } = dto;
    const id = uuidv4();
    dto.password = await bcrypt.hash(password, 10);

    delete dto.passwordRepeat;

    await this.clientRepository.save({ id: id, ...dto });

    return {
      success: true,
      message: 'User has been successfully registered',
    };
  }

  async fillProfile(
    dto: Partial<fillUpProfileDTO>,
    file?: Express.Multer.File,
  ) {
    const client = await this.clientRepository.findOne({
      where: { email: dto.email },
      relations: ['profile'],
    });

    if (!client) {
      throw new NotFoundException(`Client with email ${dto.email} not found`);
    }

    let profile = client.profile;

    if (!profile) {
      profile = this.profileRepository.create();
      profile.client = client;
    }

    if (file) {
      const imageResult =
        await this.cloudinaryService.uploadImageToCloudinary(file);
      profile.linkIImage = imageResult.url;
      profile.cloudinaryPublicId = imageResult.public_id;
    }

    if (dto.username !== undefined) client.username = dto.username;
    if (dto.firstName !== undefined) profile.firstName = dto.firstName;
    if (dto.lastName !== undefined) profile.lastName = dto.lastName;
    if (dto.gender !== undefined) profile.gender = dto.gender;
    if (dto.dateOfBirth !== undefined)
      profile.dateOfBirth = new Date(dto.dateOfBirth);

    await this.profileRepository.save(profile);

    client.profile = profile;
    await this.clientRepository.save(client);

    return profile;
  }

  async changeClientEmailAddress(dto: changeEmailDTO): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { email: dto.email },
    });

    if (client) {
      if (dto.newEmail === dto.repeatNewEmail) {
        client.email = dto.newEmail;
        await this.clientRepository.save(client);
      }
    } else {
      throw new NotFoundException(`Client with email ${dto.email} not found`);
    }
  }

  async changePassword(
    dto: changePasswordDTO,
  ): Promise<{ success: boolean; message: string }> {
    const client = await this.clientRepository.findOne({
      where: { id: dto.userId },
    });

    if (dto.newPassword !== dto.repeatNewPassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    const { newPassword } = dto;

    if (client) {
      client.password = await bcrypt.hash(newPassword, 10);
      await this.clientRepository.save(client);
      return {
        success: true,
        message: 'Password has been successfully changed',
      };
    }

    return {
      success: false,
      message: 'Password has not been successfully changed',
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.clientRepository.remove(user);
  }
}
