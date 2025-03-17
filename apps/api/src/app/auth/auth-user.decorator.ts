import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoleEnum } from '../users/users.dto';

export interface IAuthUser {
  id: string;
  name: string;
  username: string;
  role: UserRoleEnum;
}

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
