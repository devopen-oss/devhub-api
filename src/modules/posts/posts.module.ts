import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [PostsService, PostsResolver]
})
export class PostsModule {}
