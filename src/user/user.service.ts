import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { createPasswordHashed, validatePassword } from 'src/utils/password';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    return this.userRepository.save({
      ...createUserDto,
      typeUser: UserType.User,
      password: passwordHashed,
    });

  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }


  async getAllUser(): Promise<UserEntity[]>{
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} Not Found`);
    }

    return user;
  }

    async findUserByEmail(email: string): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`email: ${email} Not Found`);
    }

    return user;
  }

  async updatePasswordUser(
    updatePassword: UpdatePasswordDto,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const passwordHashed = await createPasswordHashed(
      updatePassword.newPassword,
    );

    const isMatch = await validatePassword(
      updatePassword.lastPassword,
      user.password || '',
    );

    if(!isMatch) {
      throw new BadRequestException('Last password invalid');
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
