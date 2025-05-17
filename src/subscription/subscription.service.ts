import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Subscription } from '@libs/typeorm';
import { NodemailerService } from '@libs/nodemailer';
import { EnvironmentVariables } from '@libs/env';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly nodeMailService: NodemailerService,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const existedSubscription = await this.subscriptionRepository.findOneBy({
      email: dto.email,
    });

    if (existedSubscription) {
      throw new BadRequestException(
        'Subscription with this email already exists.',
      );
    }

    const confirmToken = randomUUID();
    const unsubscribeToken = randomUUID();

    const subscription = this.subscriptionRepository.create({
      ...dto,
      confirmToken,
      unsubscribeToken,
    });
    const saved = await this.subscriptionRepository.save(subscription);
    const confirmUrl = `${this.configService.get('APP_URL')}/api/confirm/${confirmToken}`;

    await this.nodeMailService.sendConfirmationEmail(saved.email, confirmUrl);

    return saved;
  }

  async confirmSubscription(token: string): Promise<boolean> {
    const sub = await this.subscriptionRepository.findOneBy({
      confirmToken: token,
    });

    if (!sub) return false;

    sub.confirmed = true;
    sub.confirmToken = null;

    await this.subscriptionRepository.save(sub);
    return true;
  }

  async unsubscribe(token: string): Promise<boolean> {
    const sub = await this.subscriptionRepository.findOneBy({
      unsubscribeToken: token,
    });

    if (!sub) return false;

    await this.subscriptionRepository.remove(sub);
    return true;
  }
}
