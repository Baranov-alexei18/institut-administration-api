import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(email, hash);

    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.AUTH_REFRESH_SECRET,
      });

      const user = await this.usersService.findUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: process.env.AUTH_SECRET_KEY,
          expiresIn: '15m',
        },
      );

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.AUTH_SECRET_KEY_ACCESS_TOKEN,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.AUTH_SECRET_KEY_REFRESH_TOKEN,
      expiresIn: '3d',
    });

    return { accessToken, refreshToken };
  }
}
