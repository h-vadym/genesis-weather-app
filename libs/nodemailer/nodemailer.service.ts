import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';

import { WeatherReqResponse } from '../../src/weather/weather.interface';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(
    email: string,
    confirmUrl: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: {
          name: 'Weather Updates Service',
          address: 'test-mailer@gmail.com',
        },
        to: email,
        subject: 'Confirm your subscription',
        html: this._getTemplate('confirm-email.ejs', {
          confirmUrl,
        }),
      });
    } catch (error) {
      Logger.error('Failed to sendConfirmationEmail', error);
      throw new InternalServerErrorException(
        'Failed to send confirmation email',
      );
    }
  }

  async sendWeatherUpdate(
    email: string,
    data: WeatherReqResponse & {
      city: string;
      unsubscribeUrl: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: {
          name: 'Weather Updates Service',
          address: 'test-mailer@gmail.com',
        },
        to: email,
        subject: 'Your weather update',
        html: this._getTemplate('weather.ejs', data),
      });
    } catch (error) {
      Logger.error('Failed to send update email', error);
    }
  }

  private _getTemplate(file: string, tmpOptions: any) {
    const tmpDir = 'libs/nodemailer/templates';
    const template = path.join(process.cwd(), tmpDir, file);
    const tmp = fs.readFileSync(template, 'utf8');

    return ejs.render(tmp, tmpOptions);
  }
}
