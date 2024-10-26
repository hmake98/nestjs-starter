import { SendTemplatedEmailCommandOutput } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsSESService } from '../../aws/services/aws.ses.service';
import { ISendEmailParams } from '../interfaces/email.interface';
import { IHelperEmailService } from '../interfaces/email.service.interface';

@Injectable()
export class HelperEmailService implements IHelperEmailService {
    private readonly logger = new Logger(HelperEmailService.name);
    private readonly fromEmail: string;

    constructor(
        private readonly awsSESService: AwsSESService,
        private readonly configService: ConfigService
    ) {
        this.fromEmail = this.configService.get<string>('aws.ses.sourceEmail');
    }

    async sendEmail({
        emailType,
        emails,
        payload,
    }: ISendEmailParams): Promise<SendTemplatedEmailCommandOutput> {
        const templateName = emailType;
        const recipients = emails;

        try {
            const response = await this.awsSESService.send({
                templateName,
                recipients,
                sender: this.fromEmail,
                templateData: payload,
            });

            return response;
        } catch (error) {
            throw error;
        }
    }
}
