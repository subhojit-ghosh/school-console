import { IAuthUser } from '../app/auth/auth-user.decorator';

declare module 'express' {
  export interface Request {
    user?: IAuthUser;
  }
}
