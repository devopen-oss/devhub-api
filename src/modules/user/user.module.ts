import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [UserService, UserResolver]
})
export class UserModule {}
