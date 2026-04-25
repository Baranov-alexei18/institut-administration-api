import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: CreateUserDto) {
    if (!body.email || !body.password) {
      return;
    }

    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    if (!body.email || !body.password) {
      return;
    }

    const { accessToken, refreshToken } = await this.authService.login(body.email, body.password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return this.authService.refresh(refreshToken);
  }
}
