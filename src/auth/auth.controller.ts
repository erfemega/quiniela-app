import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth0Guard } from './guards/auth0.guard';
// It can be used in case of you want to use the local strategy with jwt
// import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
// import { JwtAuthGuard } from './guards/jwt.guard';
// import { UserLoginDto } from './dtos/UserLogin.dto';
// import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  // @Post('/register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   const user = await this.userService.addUser(createUserDto);
  //   return user;
  // }

  // @Post('/login')
  // @UseGuards(LocalAuthGuard)
  // @ApiBody({ type: UserLoginDto })
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user profile',
  })
  @Roles(Role.User)
  @UseGuards(Auth0Guard, RolesGuard)
  @Get('/user')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the admin dashboard info',
    description: 'Current user must have the admin role assigned',
  })
  @Roles(Role.Admin)
  @UseGuards(Auth0Guard, RolesGuard)
  @Get('/admin')
  getDashBoard(@Request() req) {
    return req.user;
  }
}
