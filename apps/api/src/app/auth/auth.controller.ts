import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthUser, IAuthUser } from './auth-user.decorator';
import { LoginDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    signed: true,
  };

  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { access_token } = await this.authService.login(
      loginDto.username,
      loginDto.password
    );

    response.cookie('access_token', access_token, {
      ...this.cookieOptions,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return {
      message: 'Logout successful',
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@AuthUser() user: IAuthUser) {
    const data: any = { ...user };

    delete data['iat'];
    delete data['exp'];

    return data;
  }
}
