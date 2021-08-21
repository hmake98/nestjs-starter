import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  public constructor(private readonly tokenService: TokenService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getArgByIndex(0);
    const token = request.headers['authorization'];
    const verify = await this.tokenService.verify(token);
    if (!verify) {
      throw new UnauthorizedException();
    }
    request.user = verify;
    return true;
  }
}
