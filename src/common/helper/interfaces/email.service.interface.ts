import { SendTemplatedEmailCommandOutput } from '@aws-sdk/client-ses';

import { ISendEmailParams } from './email.interface';

export interface IHelperEmailService {
    sendEmail(
        payload: ISendEmailParams
    ): Promise<SendTemplatedEmailCommandOutput>;
}
