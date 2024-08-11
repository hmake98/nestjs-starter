import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { EMAIL_TEMPLATE_SUBJECTS } from 'src/app/app.constant';
import { AwsSESService } from 'src/common/aws/services/aws.ses.service';

@Injectable()
export class EmailSeed {
  private readonly logger = new Logger(EmailSeed.name);

  constructor(private readonly awsSESService: AwsSESService) {}

  @Command({
    command: 'seed:emails',
    describe: 'seeds emails',
  })
  async seeds(): Promise<void> {
    try {
      const templatesDir = join(__dirname, '../../common/aws/templates');
      const templates = readdirSync(templatesDir).filter(file => file.endsWith('.hbs'));

      for (const templateFile of templates) {
        const templateName = templateFile.replace('.hbs', '');
        const subject = EMAIL_TEMPLATE_SUBJECTS[templateName];
        const htmlPart = readFileSync(join(templatesDir, templateFile), 'utf8');

        try {
          await this.awsSESService.getTemplate({ name: templateName });
          this.logger.log(`Template ${templateName} already exists. Skipping creation.`);
        } catch (error) {
          this.logger.log(`Template ${templateName} does not exist. Creating...`);

          await this.awsSESService.createTemplate({
            name: templateName,
            subject,
            htmlBody: htmlPart,
          });

          this.logger.log(`Template ${templateName} created successfully.`);
        }
      }
    } catch (error) {
      this.logger.error(`Error seeding email templates: ${error.message}`);
      throw error;
    }
  }

  @Command({
    command: 'rollback:emails',
    describe: 'remove emails',
  })
  async remove(): Promise<void> {
    try {
      const templatesDir = join(__dirname, '../../common/aws/templates');
      const templates = readdirSync(templatesDir).filter(file => file.endsWith('.hbs'));

      for (const templateFile of templates) {
        const templateName = templateFile.replace('.hbs', '');

        try {
          await this.awsSESService.deleteTemplate({ name: templateName });
          this.logger.log(`Template ${templateName} removed successfully.`);
        } catch (error) {
          this.logger.error(`Failed to remove template ${templateName}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error removing email templates: ${error.message}`);
      throw error;
    }
  }
}
