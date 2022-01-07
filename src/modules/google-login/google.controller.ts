import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Request } from 'express';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @HttpCode(201)
  @UseGuards(AuthGuard('google'))
  async login(): Promise<any> {}

  @Get('redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('google'))
  async redirect(@Req() req: Request): Promise<any> {
    return req.user;
  }
}
