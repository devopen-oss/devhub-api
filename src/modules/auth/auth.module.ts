import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        JwtModule,
        PassportModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5
        })
    ],
    providers: [AuthResolver, AuthService]
})
export class AuthModule {}
