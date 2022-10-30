import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../../shared";

@Injectable()
export class ClientAuthGuard implements CanActivate {
  public constructor(private readonly tokenService: TokenService, private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.getArgByIndex(0);
    const allowUnauthorizedRequest = this.reflector.get<boolean>("allowUnauthorizedRequest", context.getHandler());
    if (allowUnauthorizedRequest) {
      return true;
    }
    const Authorization = request.headers["authorization"];
    const token = Authorization.replace("Bearer ", "");
    const verify = this.tokenService.verify(token);
    if (!verify) {
      throw new UnauthorizedException();
    }
    request.user = verify;
    return true;
  }
}
