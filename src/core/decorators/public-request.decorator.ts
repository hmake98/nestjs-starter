import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/utils/util';

export const PublicRequest = (): CustomDecorator<string> =>
  SetMetadata(IS_PUBLIC_KEY, true);
