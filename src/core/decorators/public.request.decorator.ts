import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from '../constants/core.constant';

export const PublicRoute = (): CustomDecorator<string> =>
  SetMetadata(PUBLIC_ROUTE_KEY, true);
