import { User } from "@prisma/client";

export class AuthToken {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  user: User;
}
