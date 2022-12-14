import { Controller, Get } from "@nestjs/common";
import { AllowUnauthorizedRequest } from "./core/decorators/allow.decorator";

@Controller("health")
export class HealthController {
  constructor() {}

  @AllowUnauthorizedRequest()
  @Get("/")
  public async getHealth() {
    try {
      return { status: true };
    } catch (e) {
      return { status: false };
    }
  }
}
