import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Auth0Guard extends AuthGuard('auth0') {}
