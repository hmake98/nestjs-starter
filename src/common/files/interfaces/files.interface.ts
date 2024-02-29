import { Files } from '@prisma/client';

export interface FilesResponseInterface {
  url: string;
  file: Files;
}

export enum FileModuleType {
  user_profile = 'Profile',
  post_picture = 'Posts',
}
