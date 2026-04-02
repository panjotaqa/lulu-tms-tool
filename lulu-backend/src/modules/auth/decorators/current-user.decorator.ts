import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/modules/user/models/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;
    return user.id;
  },
);
