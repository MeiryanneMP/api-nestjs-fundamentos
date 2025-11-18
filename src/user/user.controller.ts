import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import type { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { UserType } from './enum/user-type.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Root)
  @Post('/admin')
  async createAdmin(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser, UserType.Admin);

  }

  @UsePipes(ValidationPipe)
  @Post()
  createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUser()).map(
      (UserEntity)=> new ReturnUserDto(UserEntity)
    )
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Patch()
  @UsePipes(ValidationPipe)
  async updatePasswordUser(
    @Body() updatePassword: UpdatePasswordDto,
    @UserId() userId: number,
  ): Promise<UserEntity> {
    return this.userService.updatePasswordUser(updatePassword, userId);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get()
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDto>{
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId)
    );
  }
}
