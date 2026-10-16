import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import jwtConfig from "./config/jwt.config.js";
import type { ConfigType } from "@nestjs/config";
import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from "../common/enums/roles.js";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ){
    const secret = jwtConfiguration.secret ?? 'development-secret'
   super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: jwtConfiguration.issuer,
      audience: jwtConfiguration.audience
    });
  }
  async validate(payload: {sub: string, email: string, role: Role}){
    if (!Object.values(Role).includes(payload.role)) {
      throw new UnauthorizedException('Token sem papel válido; faça login novamente');
    }

    return {
      id:payload.sub,
      email: payload.email,
      role: payload.role
    }
  }
  }
