import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ReturnLogin } from './dtos/returnLogin.dto';
import { LoginPayload } from './dtos/loginPayload.dto';
import { ReturnUserDto } from 'src/user/dtos/returnUser.dto';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined
    );

    if (!user || !user.password) {
      throw new NotFoundException('Email or password invalid');
    }

    const isMatch = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    if (user) {
      throw new BadGatewayException('email registered in system');
    }

    return {
      acessToken: this.jwtService.sign({ ...new LoginPayload(user)}),
      user: new ReturnUserDto(user),
    }
  }
}
