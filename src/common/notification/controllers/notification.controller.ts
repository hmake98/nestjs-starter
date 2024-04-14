import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notification')
@Controller({
  path: '/notification',
  version: '1',
})
export class NotificationController {
  constructor() {
    //
  }
}
