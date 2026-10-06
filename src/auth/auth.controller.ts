import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './guards/dto/login.dto.js';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  loginUser(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }
}
