export enum IStorage {
  PROFILES = 'profiles',
  POSTS = 'posts',
}

export interface IPreSignedUrlBody {
  name: string;
  userId: number;
  type: keyof typeof IStorage;
}
