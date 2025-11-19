import {
    CreateTemplateCommand,
    CreateTemplateCommandInput,
    CreateTemplateCommandOutput,
    DeleteTemplateCommand,
    DeleteTemplateCommandInput,
    DeleteTemplateCommandOutput,
    GetTemplateCommand,
    GetTemplateCommandInput,
    GetTemplateCommandOutput,
    SESClient,
    SendTemplatedEmailCommand,
    SendTemplatedEmailCommandInput,
    SendTemplatedEmailCommandOutput,
} from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import {
    IAwsSESGetTemplate,
    IAwsSESSend,
    IAwsSESTemplate,
} from '../interfaces/aws.ses.interface';
import { IAwsSESService } from '../interfaces/aws.ses.service.interface';

@Injectable()
export class AwsSESService implements IAwsSESService {
    private readonly sesClient: SESClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger
    ) {
        this.logger.setContext(AwsSESService.name);

        const region = this.configService.get<string>('aws.ses.region');
        const accessKeyId = this.configService.get<string>('aws.accessKey');
        const secretAccessKey = this.configService.get<string>('aws.secretKey');

        this.sesClient = new SESClient({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        this.logger.info({ region }, 'SES service initialized');
    }

    async getTemplate({
        name,
    }: IAwsSESGetTemplate): Promise<GetTemplateCommandOutput> {
        const command: GetTemplateCommand = new GetTemplateCommand({
            TemplateName: name,
        });

        try {
            const output = await this.sesClient.send<
                GetTemplateCommandInput,
                GetTemplateCommandOutput
            >(command);

            this.logger.debug({ templateName: name }, 'Retrieved SES template');
            return output;
        } catch (error) {
            this.logger.error(
                `Failed to get SES template ${name}: ${error.message}`
            );
            throw error;
        }
    }

    async createTemplate({
        name,
        subject,
        htmlBody,
        plainTextBody,
    }: IAwsSESTemplate): Promise<CreateTemplateCommandOutput> {
        if (!htmlBody && !plainTextBody) {
            throw new Error('Body is null');
        }

        const command: CreateTemplateCommand = new CreateTemplateCommand({
            Template: {
                TemplateName: name,
                SubjectPart: subject,
                HtmlPart: htmlBody,
                TextPart: plainTextBody,
            },
        });

        try {
            const output = await this.sesClient.send<
                CreateTemplateCommandInput,
                CreateTemplateCommandOutput
            >(command);

            this.logger.info({ templateName: name }, 'Created SES template');
            return output;
        } catch (error) {
            this.logger.error(
                `Failed to create SES template ${name}: ${error.message}`
            );
            throw error;
        }
    }

    async deleteTemplate({
        name,
    }: IAwsSESGetTemplate): Promise<DeleteTemplateCommandOutput> {
        const command = new DeleteTemplateCommand({
            TemplateName: name,
        });

        try {
            const output = await this.sesClient.send<
                DeleteTemplateCommandInput,
                DeleteTemplateCommandOutput
            >(command);

            this.logger.info({ templateName: name }, 'Deleted SES template');
            return output;
        } catch (error) {
            this.logger.error(
                `Failed to delete SES template ${name}: ${error.message}`
            );
            throw error;
        }
    }

    async send<T>({
        recipients,
        sender,
        replyTo,
        bcc,
        cc,
        templateName,
        templateData,
    }: IAwsSESSend<T>): Promise<SendTemplatedEmailCommandOutput> {
        const command: SendTemplatedEmailCommand =
            new SendTemplatedEmailCommand({
                Template: templateName,
                Destination: {
                    ToAddresses: recipients,
                    BccAddresses: bcc ?? [],
                    CcAddresses: cc ?? [],
                },
                Source: sender,
                TemplateData: JSON.stringify(templateData ?? ''),
                ReplyToAddresses: [replyTo ?? sender],
            });

        try {
            const output = await this.sesClient.send<
                SendTemplatedEmailCommandInput,
                SendTemplatedEmailCommandOutput
            >(command);

            this.logger.info(
                {
                    templateName,
                    recipients: recipients.length,
                    messageId: output.MessageId,
                },
                'Email sent via SES'
            );
            return output;
        } catch (error) {
            this.logger.error(`Failed to send email via SES: ${error.message}`);
            throw error;
        }
    }
}
