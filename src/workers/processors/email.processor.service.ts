import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { ENUM_BULL_QUEUES, ENUM_EMAIL_TEMPLATES } from 'src/app/app.constant';
import {
  ISendEmailBasePayload,
  IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';

@Processor(ENUM_BULL_QUEUES.EMAIL)
export class EmailProcessorWorkerService {
  private logger = new Logger(EmailProcessorWorkerService.name);

  constructor(private readonly helperEmailService: HelperEmailService) {}

  @Process(ENUM_EMAIL_TEMPLATES.WELCOME_EMAIL)
  async processWelcomeEmails(
    job: Job<ISendEmailBasePayload<IWelcomeEmailDataPaylaod>, any, string>,
  ) {
    const { toEmails, data } = job.data;
    this.helperEmailService.sendEmail({
      emails: toEmails,
      emailType: ENUM_EMAIL_TEMPLATES.WELCOME_EMAIL,
      payload: data,
    });
  }
}
