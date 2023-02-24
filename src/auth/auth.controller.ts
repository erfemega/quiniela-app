import {
  Body,
  Controller,
  Get,
  Patch,
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
  async getProfile(@Request() req) {
    const user = await this.userService.findUser({ _id: req.user._id });
    return user;
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
