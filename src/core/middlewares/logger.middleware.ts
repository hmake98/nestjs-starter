import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';

    this.logger.log(
      `${method} ${url} ${res.statusCode} from ${ip} using ${userAgent}`,
    );
    next();
  }
}
