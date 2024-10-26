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

import {
    IAwsSESGetTemplate,
    IAwsSESSend,
    IAwsSESTemplate,
} from '../interfaces/aws.ses.interface';
import { IAwsSESService } from '../interfaces/aws.ses.service.interface';

@Injectable()
export class AwsSESService implements IAwsSESService {
    private readonly sesClient: SESClient;

    constructor(private readonly configService: ConfigService) {
        this.sesClient = new SESClient({
            credentials: {
                accessKeyId: this.configService.get<string>(
                    'aws.ses.credential.key'
                ),
                secretAccessKey: this.configService.get<string>(
                    'aws.ses.credential.secret'
                ),
            },
            region: this.configService.get<string>('aws.ses.region'),
        });
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

            return output;
        } catch (error) {
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

            return output;
        } catch (error) {
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

            return output;
        } catch (error) {
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

            return output;
        } catch (error) {
            throw error;
        }
    }
}
