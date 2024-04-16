import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailPayload } from '../interfaces/email.interface';
import { EmailTemplates } from '../../../app/app.enum';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerServiceMock: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerServiceMock = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(done => {
    done();
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send an email with the provided payload', async () => {
      const emailPayload: EmailPayload = {
        emails: ['recipient@example.com'],
        subject: 'Test Email',
        template: EmailTemplates.WELCOME_EMAIL,
        data: { name: 'John Doe' },
      };

      await emailService.sendEmail(emailPayload);

      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
        to: emailPayload.emails,
        subject: emailPayload.subject,
        template: emailPayload.template,
        context: emailPayload.data,
      });
    });

    it('should throw an error if sending email fails', async () => {
      const emailPayload = {
        emails: ['recipient@example.com'],
        subject: 'Test Email',
        template: EmailTemplates.WELCOME_EMAIL,
        data: { name: 'John Doe' },
      };

      jest
        .spyOn(mailerServiceMock, 'sendMail')
        .mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(emailService.sendEmail(emailPayload)).rejects.toThrowError(
        'Failed to send email',
      );
    });
  });
});
