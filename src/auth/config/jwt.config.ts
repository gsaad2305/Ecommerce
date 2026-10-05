import { registerAs } from '@nestjs/config';

export default registerAs('jwt', ()=>({
  secret: process.env.JWT_SECRET ?? 'development-secret',
  audience: process.env.JWT_TOKEN_AUDIENCE ?? 'ecomerce',
  issuer: process.env.JWT_TOKEN_ISSUER,
  jwtttl: Number(process.env.JWT_TTL ?? 3600),
}));
