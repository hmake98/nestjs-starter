import {
    CreateTemplateCommandOutput,
    DeleteTemplateCommandOutput,
    GetTemplateCommandOutput,
    SendTemplatedEmailCommandOutput,
} from '@aws-sdk/client-ses';

import {
    IAwsSESGetTemplate,
    IAwsSESSend,
    IAwsSESTemplate,
} from './aws.ses.interface';

export interface IAwsSESService {
    getTemplate(params: IAwsSESGetTemplate): Promise<GetTemplateCommandOutput>;
    createTemplate(
        template: IAwsSESTemplate
    ): Promise<CreateTemplateCommandOutput>;
    deleteTemplate(
        params: IAwsSESGetTemplate
    ): Promise<DeleteTemplateCommandOutput>;
    send<T>(params: IAwsSESSend<T>): Promise<SendTemplatedEmailCommandOutput>;
}
