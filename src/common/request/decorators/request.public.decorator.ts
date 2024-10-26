import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { PUBLIC_ROUTE_KEY } from '../constants/request.constant';

export const PublicRoute = (): CustomDecorator<string> =>
    SetMetadata(PUBLIC_ROUTE_KEY, true);
