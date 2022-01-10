import { Controller, Get, HttpStatus, UseGuards, Req, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('facebook')
export class FacebookController {
  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard('facebook'))
  async login(): Promise<any> {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('redirect')
  @UseGuards(AuthGuard('facebook'))
  async loginRedirect(@Req() req: Request): Promise<any> {
    return req.user;
  }
}
