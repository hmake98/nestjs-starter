import { BootstrapConsole } from 'nestjs-console';

import { AppModule } from './app.module';

BootstrapConsole.init({
  contextOptions: { logger: ['error', 'warn'] },
  module: AppModule,
})
  .then(({ app, boot }) => {
    boot();
  })
  .catch((e) => console.log('Error', e));
