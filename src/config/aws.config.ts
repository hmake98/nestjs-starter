import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    linkExpire: process.env.AWS_LINK_EXPIRES,
    sourceEmail: process.env.SOURCE_EMAIL,
    bucket: process.env.AWS_BUCKET,
  }),
);
