import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    if (!user || !user.password) {
      throw new NotFoundException('Email or password invalid');
    }

    const isMatch = await compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    return user;
  }
}
