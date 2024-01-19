import { Controller } from '@nestjs/common';

@Controller({
  path: '/files',
  version: '1',
})
export class FilesController {
  constructor() {
    //
  }
}
