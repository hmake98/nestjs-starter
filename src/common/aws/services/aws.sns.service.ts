import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAwsSNSService } from '../interfaces/aws.sns.service.interface';

@Injectable()
export class AwsSNSService implements IAwsSNSService {
    private logger = new Logger(AwsSNSService.name);
    private readonly snsClient: SNSClient;

    constructor(private readonly configService: ConfigService) {
        this.snsClient = new SNSClient({
            credentials: {
                accessKeyId: this.configService.get<string>('aws.accessKey'),
                secretAccessKey:
                    this.configService.get<string>('aws.secretKey'),
            },
            region: this.configService.get<string>('aws.region'),
        });
    }

    async sendSms(phoneNumber: string, message: string): Promise<string> {
        try {
            const command = new PublishCommand({
                PhoneNumber: phoneNumber,
                Message: message,
            });
            const response = await this.snsClient.send(command);
            this.logger.log(
                `SMS sent to ${phoneNumber} with MessageId: ${response.MessageId}`
            );
            return response.MessageId;
        } catch (error) {
            throw error;
        }
    }
}
