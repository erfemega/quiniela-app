import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let user;
    try {
      user = await this.userService.findUser({ email }, false);
    } catch (err) {
      throw new UnauthorizedException();
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatch) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserDataFromProvider(token: string): Promise<any> {
    try {
      const userData = await axios.get(
        `https://${process.env.AUTH0_ISSUER_URL}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!userData) {
        throw new UnauthorizedException();
      }
      return userData;
    } catch (error) {
      console.log(error);
    }
  }
}
