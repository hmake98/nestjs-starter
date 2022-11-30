import { HttpException, HttpStatus, Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { AuthToken } from "src/shared/interfaces";
import { TokenService } from "src/shared/services/token.service";
import { UserCreateDto, UserUpdateDto, UserLoginDto } from "./dto";
import { helpers } from "src/utils/helper";
import { PrismaService } from "src/shared";
import { Role, User } from "@prisma/client";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class UserService {
  constructor(private readonly tokenService: TokenService, private readonly prisma: PrismaService, @InjectQueue("notification") private notificationQueue: Queue) {}

  public async login(data: UserLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!checkUser) {
        throw new HttpException("auth.user_not_found", HttpStatus.NOT_FOUND);
      }
      if (!helpers.match(checkUser.password, password)) {
        throw new HttpException("auth.invalid_password", HttpStatus.BAD_REQUEST);
      }
      return this.tokenService.generateNewTokens(checkUser);
    } catch (e) {
      throw e instanceof HttpException ? e : new InternalServerErrorException(e);
    }
  }

  public async signup(data: UserCreateDto): Promise<AuthToken> {
    try {
      const { password, firstName, lastName } = data;
      const newUser = {} as User;
      const hashPassword = helpers.createHash(password);
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstName.trim();
      newUser.lastName = lastName.trim();
      newUser.role = Role.USER;
      const user = await this.prisma.user.create({
        data: newUser,
      });
      this.notificationQueue.add({ message: "Welcome!" });
      return this.tokenService.generateNewTokens(user);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new HttpException("auth.user_exists", HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
  }

  public async getToken(refreshToken: string): Promise<AuthToken> {
    try {
      const match = this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException("auth.invalid_token");
      }
      const user = await this.prisma.user.findUnique({ where: { id: match.id } });
      if (!user) {
        throw new BadRequestException("auth.user_not_found");
      }
      return this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw e instanceof HttpException ? e : new InternalServerErrorException(e);
    }
  }

  public async update(id: number, data: UserUpdateDto): Promise<User> {
    const { email, firstName, lastName, phone, photoId } = data;
    return this.prisma.user.update({
      data: {
        email,
        firstName,
        lastName,
        phone,
        userProfile: {
          connect: {
            id: photoId,
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
