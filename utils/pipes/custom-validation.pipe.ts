import { ValidationPipe } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    const validatorOpts: ValidatorOptions = {};
    super(validatorOpts);
    this.isTransformEnabled = true;
    this.validatorOptions = {
      ...this.validatorOptions,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
    };
  }
}
