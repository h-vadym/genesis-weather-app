import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('api')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    await this.subscriptionService.create(dto);
    return { message: 'Subscription created. Please confirm via email.' };
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string, @Res() res: Response) {
    const confirmed = await this.subscriptionService.confirmSubscription(token);
    return res.redirect(confirmed ? '/confirmed.html' : '/error.html');
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string, @Res() res: Response) {
    const unsubscribed = await this.subscriptionService.unsubscribe(token);
    return res.redirect(unsubscribed ? '/unsubscribed.html' : '/error.html');
  }
}
