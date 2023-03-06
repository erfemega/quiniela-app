import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { Role } from '../enums/role.enum';
import { EventsService } from 'src/events/events.service';
import { getUserIdFromEmail } from 'src/utils/userUtils';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private eventsService: EventsService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_ISSUER_URL}/`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    let user = await this.userService.findUser({
      email: getUserIdFromEmail(payload.email),
    });
    if (!user) {
      const token = request.headers.authorization.split(' ')[1];
      const userData = await this.authService.getUserDataFromProvider(token);
      const newUser = {
        email: getUserIdFromEmail(userData.data.email),
        name: `${userData.data.name}`,
        roles: [Role.User],
        picture: userData.data.picture,
      };
      user = await this.userService.addUser(newUser);
    }
    return user;
  }
}
