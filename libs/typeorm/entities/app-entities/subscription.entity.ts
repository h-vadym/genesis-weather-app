import { Entity, Column, Index } from 'typeorm';
import { IsEmail, IsEnum, IsString, IsBoolean, IsUUID } from 'class-validator';

import { DefaultFields } from '../abstract.entity';

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

@Entity('subscriptions')
export class Subscription extends DefaultFields {
  @Column()
  @IsEmail()
  @Index()
  email: string;

  @Column()
  @IsString()
  @Index()
  city: string;

  @Column({ type: 'enum', enum: Frequency })
  @IsEnum(Frequency)
  frequency: Frequency;

  @Column({ default: false })
  @IsBoolean()
  confirmed: boolean;

  @Column({ type: 'uuid', unique: true, nullable: true })
  @IsUUID()
  confirmToken: string | null;

  @Column({ type: 'uuid', unique: true, nullable: true })
  @IsUUID()
  unsubscribeToken: string | null;
}
