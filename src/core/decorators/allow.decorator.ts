import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const AllowUnauthorizedRequest = (): CustomDecorator => SetMetadata("allowUnauthorizedRequest", true);
