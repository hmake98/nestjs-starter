/**
 * Migration file template
 */
export const templateGen = (className: string, baseFilename: string) => {
  return `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {}

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
`;
};

/**
 * Status messages
 */
export const statusMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
};

/**
 * Email templates
 */
export const TEMPLATES = {
  FORGOT_PASSWORD: 'forgot-password',
  WELCOME: 'welcome',
};
