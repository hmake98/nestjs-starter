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

export interface IFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}
