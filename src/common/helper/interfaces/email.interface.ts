import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';

export interface ISendEmailParams {
    emailType: AWS_SES_EMAIL_TEMPLATES;
    emails: string[];
    payload: Record<string, any>;
}

export interface ISendEmailBasePayload<T> {
    data: T;
    toEmails: string[];
}

export interface IWelcomeEmailDataPaylaod {
    userName: string;
}
