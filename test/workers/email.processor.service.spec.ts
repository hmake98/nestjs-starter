import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';

import { AWS_SES_EMAIL_TEMPLATES } from 'src/common/aws/enums/aws.ses.enum';
import {
    ISendEmailBasePayload,
    IWelcomeEmailDataPaylaod,
} from 'src/common/helper/interfaces/email.interface';
import { HelperEmailService } from 'src/common/helper/services/helper.email.service';
import { EmailProcessorWorker } from 'src/workers/processors/email.processor';

describe('EmailProcessorWorkerService', () => {
    let service: EmailProcessorWorker;
    let helperEmailServiceMock: jest.Mocked<HelperEmailService>;
    let loggerMock: jest.Mocked<Logger>;

    beforeEach(async () => {
        helperEmailServiceMock = {
            sendEmail: jest.fn(),
        } as unknown as jest.Mocked<HelperEmailService>;

        loggerMock = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<Logger>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailProcessorWorker,
                {
                    provide: HelperEmailService,
                    useValue: helperEmailServiceMock,
                },
                { provide: Logger, useValue: loggerMock },
            ],
        }).compile();

        service = module.get<EmailProcessorWorker>(EmailProcessorWorker);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('processWelcomeEmails', () => {
        it('should process the welcome email job and call sendEmail', async () => {
            const jobData: ISendEmailBasePayload<IWelcomeEmailDataPaylaod> = {
                toEmails: ['test@example.com'],
                data: { userName: 'Test User' },
            };
            const jobMock = { data: jobData } as Job<
                ISendEmailBasePayload<IWelcomeEmailDataPaylaod>
            >;

            await service.processWelcomeEmails(jobMock);

            expect(helperEmailServiceMock.sendEmail).toHaveBeenCalledWith({
                emails: jobData.toEmails,
                emailType: AWS_SES_EMAIL_TEMPLATES.WELCOME_EMAIL,
                payload: jobData.data,
            });
        });
    });
});
