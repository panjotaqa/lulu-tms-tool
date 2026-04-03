import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthControllerDocs } from './auth.controller.doc';
import { AUTH_SERVICE } from '@/modules/core/constants/services.constants';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponseDto } from '../models/dto/auth-response.dto';
import { LoginDto } from '../models/dto/login.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @AuthControllerDocs.login()
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuthControllerDocs.logout()
  logout(): { message: string } {
    return this.authService.logout();
  }
}
