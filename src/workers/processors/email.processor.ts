import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PinoLogger } from 'nestjs-pino';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';
import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';
import {
    ISendEmailBasePayload,
    IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';

@Processor(APP_BULL_QUEUES.EMAIL)
export class EmailProcessorWorker {
    constructor(
        private readonly helperEmailService: HelperEmailService,
        private readonly logger: PinoLogger
    ) {
        this.logger.setContext(EmailProcessorWorker.name);
    }

    @Process(AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL)
    async processWelcomeEmails(
        job: Job<ISendEmailBasePayload<IWelcomeEmailDataPaylaod>>
    ) {
        const { toEmails, data } = job.data;

        this.logger.info(
            { jobId: job.id, recipients: toEmails.length },
            'Processing welcome email job'
        );

        try {
            await this.helperEmailService.sendEmail({
                emails: toEmails,
                emailType: AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
                payload: data,
            });

            this.logger.info(
                { jobId: job.id, recipients: toEmails.length },
                'Welcome emails sent successfully'
            );
        } catch (error) {
            this.logger.error(
                { jobId: job.id, error: error.message },
                `Failed to send welcome emails: ${error.message}`
            );
            throw error;
        }
    }
}
