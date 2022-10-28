

import { SetMetadata } from '@nestjs/common';

export const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true);