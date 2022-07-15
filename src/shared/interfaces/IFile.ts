export interface IPreSignedUrlParams {
  Bucket?: string;
  Key: string;
  Expires?: number;
  ContentType?: string;
}

export interface IPreSignedUrlBody {
  key: string;
  mime: string;
}
