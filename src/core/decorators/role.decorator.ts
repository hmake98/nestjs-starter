import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
