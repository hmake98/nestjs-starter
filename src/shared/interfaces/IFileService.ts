/*
 * interface for s3 method parameters
 */
export interface IPreSignedUrlParams {
  Bucket?: string;
  Key: string;
  Expires?: number;
  ContentType?: string;
}

/*
 * interface for request body
 */
export interface IPreSignedUrlBody {
  key: string;
  mime: string;
}
