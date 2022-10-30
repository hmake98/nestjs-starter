export interface IPreSignedUrlParams {
  Bucket?: string;
  Key: string;
  Expires?: number;
  ContentType?: string;
}

export interface IPreSignedUrlBody {
  name: string;
  userId: number;
  type: keyof typeof IStorageType;
}

enum IStorageType {
  PROFILES,
  POSTS,
}
