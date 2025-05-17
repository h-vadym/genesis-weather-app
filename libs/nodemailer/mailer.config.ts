import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@libs/env';

export const mailerConfig = MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
    transport: {
      host: configService.get<string>('SMTP_HOST'),
      port: configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: configService.get<string>('SMTP_USER'),
        pass: configService.get<string>('SMTP_PASS'),
      },
    },
    defaults: {
      from: 'Weather Updates Service',
    },
  }),
});
