import { Gender } from '../types/gender';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({
    type: 'timestamp with time zone',
    name: 'dateOfBirth',
  })
  dateOfBirth: Date;

  @Column('text')
  linkIImage: string;

  @Column({ nullable: true })
  cloudinaryPublicId: string;

  @OneToOne(() => Client, (client) => client.profile)
  client: Client;
}
