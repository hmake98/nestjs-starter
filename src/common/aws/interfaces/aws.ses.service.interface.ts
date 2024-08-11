import {
  CreateTemplateCommandOutput,
  DeleteTemplateCommandOutput,
  GetTemplateCommandOutput,
  SendTemplatedEmailCommandOutput,
} from '@aws-sdk/client-ses';

import { AwsSESGetTemplate, AwsSESSend, AwsSESTemplate } from '../../helper/dtos/aws.ses.dto';

export interface IAwsSESService {
  getTemplate(params: AwsSESGetTemplate): Promise<GetTemplateCommandOutput>;
  createTemplate(template: AwsSESTemplate): Promise<CreateTemplateCommandOutput>;
  deleteTemplate(params: AwsSESGetTemplate): Promise<DeleteTemplateCommandOutput>;
  send<T>(params: AwsSESSend<T>): Promise<SendTemplatedEmailCommandOutput>;
}
