import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';
import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';
import {
    ISendEmailBasePayload,
    IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';

@Processor(APP_BULL_QUEUES.EMAIL)
export class EmailProcessorWorker {
    private logger = new Logger(EmailProcessorWorker.name);

    constructor(private readonly helperEmailService: HelperEmailService) {}

    @Process(AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL)
    async processWelcomeEmails(
        job: Job<ISendEmailBasePayload<IWelcomeEmailDataPaylaod>, any, string>
    ) {
        const { toEmails, data } = job.data;

        await this.helperEmailService.sendEmail({
            emails: toEmails,
            emailType: AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
            payload: data,
        });

        this.logger.log('Email sent!');
    }
}
