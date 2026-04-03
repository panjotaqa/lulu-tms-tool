import { LoginDto } from '../models/dto/login.dto';
import { AuthResponseDto } from '../models/dto/auth-response.dto';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  logout(): { message: string };
}
