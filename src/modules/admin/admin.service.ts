import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { generate } from 'generate-password';
import * as moment from 'moment';
import { nanoid, customAlphabet } from 'nanoid';
import { Connection, Not } from 'typeorm';

import { Errors } from 'src/common/errors';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AdminService {
  public limit: number;

  constructor(private readonly configService: ConfigService) {
    this.limit = this.configService.get('limit');
  }
}
