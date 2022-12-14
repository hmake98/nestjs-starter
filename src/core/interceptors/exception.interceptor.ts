import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response, Request } from "express";
import { getI18nContextFromRequest } from "nestjs-i18n";

@Catch(HttpException)
export class ErrorExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorExceptionsFilter.name);
  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const i18n = getI18nContextFromRequest(request);
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = await i18n.translate(`auth.${exception.message}`, { lang: i18n.lang });
    response.status(statusCode).json({
      statusCode,
      message: message || "Internal server error",
    });
  }
}
