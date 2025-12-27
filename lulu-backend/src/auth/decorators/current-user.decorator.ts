import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/models/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    return user.id;
  },
);

