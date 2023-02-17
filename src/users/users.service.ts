import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create({
        ...createUserDto,
        roles: Role.User,
      });
      newUser.password = await bcrypt.hash(newUser.password, 10);
      return newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('El usuario ya existe');
      }
      throw new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(query: object, safe = true): Promise<any> {
    const user = await await this.userModel.findOne(query);
    if (!user) {
      throw new UnauthorizedException('Provided credentials are wrong');
    }
    delete user.password;
    const safeUser = user.toObject();
    delete safeUser.password;
    return safe ? safeUser : user;
  }
}
