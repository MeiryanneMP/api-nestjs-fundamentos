import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'senhaMuitoGrandeParaNaoPerder', //adicionar uma env aq
      signOptions: {expiresIn: '60s'}, //adicionar env aq tb
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
