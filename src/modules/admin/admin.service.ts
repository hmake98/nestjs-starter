import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { AdminCreateDto, AdminLoginDto, AdminUpdateDto, ListUsersDto } from './dto';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { createHash, match } from 'src/utils/helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { Role } from 'src/database/schemas/role.schema';

@Injectable()
export class AdminService {
  private limit: number;
  private skip: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    this.limit = this.configService.get('limit');
    this.skip = this.configService.get('skip');
  }

  public async login(data: AdminLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.userModel.findOne({ email }).exec();
      if (!checkUser) {
        throw new HttpException('USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }
      if (!match(checkUser.password, password)) {
        throw new HttpException('INVALID_PASSWORD', HttpStatus.CONFLICT);
      }
      const payload = {
        _id: checkUser._id.toString(),
        email: checkUser.email,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        role: checkUser.role,
      };
      return await this.tokenService.generateNewTokens(payload);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async signup(data: AdminCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.userModel.findOne({ email });
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = {} as AdminCreateDto;
      const hashPassword = createHash(password);
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstName.trim();
      newUser.lastName = lastName.trim();
      newUser.role = Role.ADMIN;
      const user = await this.userModel.create(newUser);
      const payload = {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      return await this.tokenService.generateNewTokens(payload);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async getToken(refreshToken: string): Promise<AuthToken> {
    try {
      const match = await this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException();
      }
      const user = await this.userModel.findOne({ email: match.email });
      if (!user) {
        throw new BadRequestException();
      }
      const payload = {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      return await this.tokenService.generateNewTokens(payload);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }

  public async update(id: Schema.Types.ObjectId, data: AdminUpdateDto): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, data, { new: true });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async delete(id: Schema.Types.ObjectId): Promise<any> {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async list(query: ListUsersDto): Promise<User[]> {
    try {
      const { limit, sort, search, field, page } = query;

      const take = limit ? limit : this.limit;
      const skip = (page - 1) * take || this.skip;
      let orderMethod = [];
      if (field == 'email') {
        orderMethod = [['email', sort.toLowerCase() === 'asc' ? 1 : -1]];
      } else {
        orderMethod = [['createdAt', -1]];
      }

      return await this.userModel.find({ role: Role.ADMIN }).sort(orderMethod).limit(take).skip(skip).exec();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
