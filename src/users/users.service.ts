import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dtos/CreateUser.dto';
import { Model } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { getUserIdFromEmail } from 'src/utils/userUtils';

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
      return newUser.save();
    } catch (error) {
      console.log(error.message);
      if (error.code === 11000) {
        throw new BadRequestException('El usuario ya existe');
      }
      throw new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(query: any): Promise<any> {
    const user = await await this.userModel.findOne(query);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
    );
    return updatedUser;
  }

  async addEvent(userId: string, event) {
    const user = await this.findUser({ _id: userId });
    if (user.events) {
      user.events = [...user.events, event._id];
    } else {
      user.events = [event._id];
    }
    const updatedUser = await this.updateUser(user._id, user);
    return updatedUser;
  }
}
