import { exec } from 'child_process';
import { DataSource } from 'typeorm';
import { Console, Command } from 'nestjs-console';
import path from 'path';

@Console({
  command: 'db',
})
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  @Command({
    command: 'migrate:create <name>',
    description: 'create new migration',
  })
  async createMigration(name: string) {
    const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${path.join(
      __dirname,
      'migrations',
    )}/${name}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        process.exit(0);
      }
      console.log(stdout, stderr);
    });
  }

  @Command({
    command: 'migrate:gen <name>',
    description: 'generate new migration',
  })
  async generateMigration(name: string) {
    const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ${path.join(
      __dirname,
      'migrations',
    )}/${name} -d ${path.join(__dirname, 'ormconfig.ts')}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        process.exit(0);
      }
      console.log(stdout, stderr);
    });
  }

  @Command({
    command: 'migrate:up',
    description: 'Run migrations up',
  })
  async migrateUp() {
    await this.dataSource.runMigrations();
    process.exit(0);
  }

  @Command({
    command: 'migrate:down',
    description: 'Run migrations down',
  })
  async migrateDown() {
    await this.dataSource.undoLastMigration();
    process.exit(0);
  }
}
