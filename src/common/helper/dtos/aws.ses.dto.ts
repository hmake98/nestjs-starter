import { ApiProperty } from '@nestjs/swagger';

export class AwsSESTemplate {
  @ApiProperty({
    required: true,
  })
  name: string;

  @ApiProperty({
    required: false,
  })
  htmlBody?: string;

  @ApiProperty({
    required: true,
  })
  subject: string;

  @ApiProperty({
    required: false,
  })
  plainTextBody?: string;
}

export class AwsSESGetTemplate {
  @ApiProperty({
    required: true,
  })
  name: string;
}

export class AwsSESSend<T> {
  @ApiProperty({
    required: true,
  })
  templateName: string;

  @ApiProperty({
    required: false,
  })
  templateData?: T;

  @ApiProperty({
    required: true,
  })
  sender: string;

  @ApiProperty({
    required: false,
  })
  replyTo?: string;

  @ApiProperty({
    required: true,
    isArray: true,
  })
  recipients: string[];

  @ApiProperty({
    required: true,
    isArray: true,
  })
  cc?: string[];

  @ApiProperty({
    required: true,
    isArray: true,
  })
  bcc?: string[];
}

export class AwsSESSendBulkRecipients<T> {
  @ApiProperty({
    required: true,
  })
  recipient: string;

  @ApiProperty({
    required: false,
  })
  templateData?: T;
}

export class AwsSESSendBulk<T> {
  @ApiProperty({
    required: true,
    isArray: true,
    type: () => AwsSESSendBulkRecipients,
  })
  recipients: AwsSESSendBulkRecipients<T>[];

  @ApiProperty({
    required: true,
  })
  templateName: string;

  @ApiProperty({
    required: true,
  })
  sender: string;

  @ApiProperty({
    required: false,
  })
  replyTo?: string;

  @ApiProperty({
    required: true,
    isArray: true,
  })
  cc?: string[];

  @ApiProperty({
    required: true,
    isArray: true,
  })
  bcc?: string[];
}
