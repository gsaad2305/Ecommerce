import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config.js";
import type { ConfigType } from "@nestjs/config";
import { Request } from 'express'
@Injectable()
export class AutoTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if(!token) {
      throw new UnauthorizedException(`Token ausente!\nTente Novamente`)
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfiguration.secret,
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience
    });

    return true;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    const [type, token] = authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
