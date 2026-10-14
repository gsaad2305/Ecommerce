import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/roles.js";

export const ROLES_KEY = process.env.KEY_ROLE
export const Roles = (...role: Role[]) =>
SetMetadata(ROLES_KEY, role)

