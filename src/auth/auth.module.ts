import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'auth0' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '180s' },
    }),
    EventsModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, Auth0Strategy],
  controllers: [AuthController],
})
export class AuthModule {}
