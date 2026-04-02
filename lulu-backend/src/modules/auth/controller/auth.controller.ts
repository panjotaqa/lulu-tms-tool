import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponseDto } from '../models/dto/auth-response.dto';
import { LoginDto } from '../models/dto/login.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
    schema: {
      example: {
        token: 'example',
        id: '12345678-90ab-cdef-1234-567890abcdef',
        name: 'João Silva',
        email: 'joao.silva@example.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['Email é obrigatório', 'Senha é obrigatória'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Realizar logout de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    schema: {
      example: {
        message: 'Logout realizado com sucesso',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  logout(): { message: string } {
    return this.authService.logout();
  }
}
