export interface IAwsSESTemplate {
    name: string;
    htmlBody?: string;
    subject: string;
    plainTextBody?: string;
}

export interface IAwsSESGetTemplate {
    name: string;
}

export interface IAwsSESSend<T> {
    templateName: string;
    templateData?: T;
    sender: string;
    replyTo?: string;
    recipients: string[];
    cc?: string[];
    bcc?: string[];
}

export interface IAwsSESSendBulkRecipients<T> {
    recipient: string;
    templateData?: T;
}

export interface IAwsSESSendBulk<T> {
    recipients: IAwsSESSendBulkRecipients<T>[];
    templateName: string;
    sender: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
}
