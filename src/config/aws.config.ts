import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,

    s3: {
      linkExpire: process.env.AWS_PRESIGN_LINK_EXPIRES,
      bucket: process.env.AWS_BUCKET,
    },

    ses: {
      sourceEmail: process.env.SOURCE_EMAIL,
    },
  }),
);
