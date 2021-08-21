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
