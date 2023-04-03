import { UserService } from '#modules/user/user.service';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [PostsService, PostsResolver, UserService]
})
export class PostsModule {}
