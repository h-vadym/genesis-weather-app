import { Module } from '@nestjs/common';

import { mailerConfig } from './mailer.config';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [mailerConfig],
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
