import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { HashingService } from './hashing/hashing.service.js';
import jwtConfig from './config/jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import {JwtService} from '@nestjs/jwt'
import { LoginDto } from './guards/dto/login.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  async login(loginDto: LoginDto) {
    const userValid = await this.prismaService.user.findUnique({
      where:{
        email: loginDto.email
      }
    });

    if (!userValid) throw new UnauthorizedException("Crendencias Inválidas");

    const compareUsuario = await this.hashingService.compare(
      loginDto.password,
      userValid.password,
    );

    if(!compareUsuario){
      throw new UnauthorizedException("Credenciais inválidas!")
    }

    const vendedor = await this.prismaService.vendedor.findFirst({
      where:{
        userId: userValid.id
      },
      select:{
        id: true
      }
    });
    
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userValid.id,
        email: userValid.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtttl,
      }
    );

    return {
      accessToken,
      vendedorId: vendedor?.id ??null
    }
  }
}
