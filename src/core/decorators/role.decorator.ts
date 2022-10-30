import { SetMetadata, CustomDecorator } from "@nestjs/common";
import { Role } from "@prisma/client";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);
