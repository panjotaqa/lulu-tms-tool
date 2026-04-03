import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/modules/user/service/user.service';
import { USER_SERVICE } from '@/modules/core/constants/services.constants';

import { User } from '@/modules/user/models/entity/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

export function isJwtPayload(payload: unknown): payload is JwtPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'sub' in payload &&
    typeof (payload as Record<string, unknown>).sub === 'string' &&
    'email' in payload &&
    typeof (payload as Record<string, unknown>).email === 'string'
  );
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: unknown): Promise<Omit<User, 'password'>> {
    if (!isJwtPayload(payload)) {
      throw new UnauthorizedException('Payload do token inválido');
    }
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}
