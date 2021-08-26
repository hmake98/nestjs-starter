import { Console, Command } from 'nestjs-console';
import { Connection } from 'typeorm';
import * as dateFns from 'date-fns';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import { templateGen } from 'src/common/constant';

@Console({
  name: 'db',
  description: 'Database related commands (migrations, etc)',
})
export class DatabaseService {
  constructor(private readonly connection: Connection) {}

  @Command({
    command: 'migrate:up',
    description: 'Run migrations up',
  })
  async migrateUp() {
    await this.connection.runMigrations();
    process.exit(0);
  }

  @Command({
    command: 'migrate:down',
    description: 'Run migration one migration down',
  })
  async migrateDown() {
    await this.connection.undoLastMigration();
    process.exit(0);
  }

  @Command({
    command: 'migrate:create <name>',
    description: 'Creates a new migration',
  })
  async create(name: string) {
    try {
      const migrationPath = path.resolve(__dirname, 'migrations');
      if (!fs.existsSync(migrationPath)) {
        fs.mkdirSync(migrationPath);
      }
      if (!name) {
        console.log('Please specify a name for your migration in camelCase or kebab-case.');
        return;
      }
      const date = dateFns.format(new Date(), 'yyyyMMddHHmmss');
      const kebabName = _.kebabCase(name);
      let camelName = _.camelCase(name);
      camelName = camelName.charAt(0).toUpperCase() + camelName.slice(1);

      const baseFilename = `${date}-${kebabName}`;
      const newFilename = path.resolve(migrationPath, `${baseFilename}.ts`);
      const className = camelName + date;

      const template = templateGen(className, baseFilename);
      await this.writeFile(newFilename, template);
      process.exit(0);
    } catch (e) {
      console.log(e);
    }
  }

  async writeFile(filename, data): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
