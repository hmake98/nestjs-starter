import { Injectable } from '@nestjs/common';
import { IAwsSESService } from '../interfaces/aws.ses.service.interface';
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
  ListTemplatesCommand,
  ListTemplatesCommandInput,
  ListTemplatesCommandOutput,
  SESClient,
  SendBulkTemplatedEmailCommand,
  SendBulkTemplatedEmailCommandInput,
  SendBulkTemplatedEmailCommandOutput,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
  SendTemplatedEmailCommandOutput,
  UpdateTemplateCommand,
  UpdateTemplateCommandInput,
  UpdateTemplateCommandOutput,
} from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import {
  AwsSESCreateTemplateDto,
  AwsSESGetTemplateDto,
  AwsSESSendBulkDto,
  AwsSESSendDto,
  AwsSESUpdateTemplateDto,
} from '../dtos/aws.ses.dto';

@Injectable()
export class AwsSESService implements IAwsSESService {
  private readonly sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKey'),
        secretAccessKey: this.configService.get<string>('aws.secretKey'),
      },
      region: this.configService.get<string>('aws.region'),
    });
  }

  async listTemplates(nextToken?: string): Promise<ListTemplatesCommandOutput> {
    const command: ListTemplatesCommand = new ListTemplatesCommand({
      MaxItems: 20,
      NextToken: nextToken,
    });

    try {
      const listTemplate: ListTemplatesCommandOutput =
        await this.sesClient.send<
          ListTemplatesCommandInput,
          ListTemplatesCommandOutput
        >(command);
      return listTemplate;
    } catch (err: any) {
      throw err;
    }
  }

  async getTemplate({ name }: AwsSESGetTemplateDto) {
    const command: GetTemplateCommand = new GetTemplateCommand({
      TemplateName: name,
    });

    try {
      const getTemplate: GetTemplateCommandOutput = await this.sesClient.send<
        GetTemplateCommandInput,
        GetTemplateCommandOutput
      >(command);

      return getTemplate;
    } catch (err: any) {
      throw err;
    }
  }

  async createTemplate({
    name,
    subject,
    htmlBody,
    plainTextBody,
  }: AwsSESCreateTemplateDto) {
    if (!htmlBody && !plainTextBody) {
      throw new Error('body is null');
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
      const create: CreateTemplateCommandOutput = await this.sesClient.send<
        CreateTemplateCommandInput,
        CreateTemplateCommandOutput
      >(command);

      return create;
    } catch (err: any) {
      throw err;
    }
  }

  async updateTemplate({
    name,
    subject,
    htmlBody,
    plainTextBody,
  }: AwsSESUpdateTemplateDto) {
    if (!htmlBody && !plainTextBody) {
      throw new Error('body is null');
    }

    const command: UpdateTemplateCommand = new UpdateTemplateCommand({
      Template: {
        TemplateName: name,
        SubjectPart: subject,
        HtmlPart: htmlBody,
        TextPart: plainTextBody,
      },
    });

    try {
      const update: UpdateTemplateCommandOutput = await this.sesClient.send<
        UpdateTemplateCommandInput,
        UpdateTemplateCommandOutput
      >(command);

      return update;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteTemplate({ name }: AwsSESGetTemplateDto) {
    const command: DeleteTemplateCommand = new DeleteTemplateCommand({
      TemplateName: name,
    });

    try {
      const del: DeleteTemplateCommandOutput = await this.sesClient.send<
        DeleteTemplateCommandInput,
        DeleteTemplateCommandOutput
      >(command);

      return del;
    } catch (err: any) {
      throw err;
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
  }: AwsSESSendDto<T>) {
    const command: SendTemplatedEmailCommand = new SendTemplatedEmailCommand({
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
      const sendWithTemplate: SendTemplatedEmailCommandOutput =
        await this.sesClient.send<
          SendTemplatedEmailCommandInput,
          SendTemplatedEmailCommandOutput
        >(command);

      return sendWithTemplate;
    } catch (err: any) {
      throw err;
    }
  }

  async sendBulk({
    recipients,
    sender,
    replyTo,
    bcc,
    cc,
    templateName,
  }: AwsSESSendBulkDto) {
    const command: SendBulkTemplatedEmailCommand =
      new SendBulkTemplatedEmailCommand({
        Template: templateName,
        Destinations: recipients.map((e) => ({
          Destination: {
            ToAddresses: [e.recipient],
            BccAddresses: bcc ?? [],
            CcAddresses: cc ?? [],
          },
          ReplacementTemplateData: JSON.stringify(e.templateData ?? ''),
        })),
        Source: sender,
        ReplyToAddresses: [replyTo ?? sender],
      });

    try {
      const sendWithTemplate: SendBulkTemplatedEmailCommandOutput =
        await this.sesClient.send<
          SendBulkTemplatedEmailCommandInput,
          SendBulkTemplatedEmailCommandOutput
        >(command);

      return sendWithTemplate;
    } catch (err: any) {
      throw err;
    }
  }
}
