import { HttpException, HttpStatus, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Errors } from 'src/common/errors';
import { User } from 'src/database/entities/user.entity';
import { Token } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { handleError } from 'src/utils/utils';
import { UserRepository } from '../../shared/repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly tokenService: TokenService) {}

  public async login(pin: number): Promise<void> {
    try {
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }

  public async getToken(refreshToken: string): Promise<Token> {
    try {
      const match = await this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException({ message: Errors.ErrorMessages.INVALID_TOKEN });
      }
      const user = await this.userRepo.findOne({ id: match.id });
      if (!user) {
        throw new BadRequestException({ message: Errors.ErrorMessages.USER_NOT_FOUND });
      }
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }
}
