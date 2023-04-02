import { CurrentUser } from '#lib/decorators/current-user.decorator';
import { AccessTokenGuard } from '#modules/auth/guards/access.guard';
import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';
import {
	Post,
	PostCreateWithoutAuthorInput,
	PostUpdateWithoutAuthorInput
} from '#root/@generated';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class PostsResolver {
	public constructor(private readonly _postsService: PostsService) {}

	@UseGuards(AccessTokenGuard)
    @Mutation(() => Post)
	public async createPost(
		@Args('data') data: PostCreateWithoutAuthorInput,
		@CurrentUser() author: JwtPayload
	) {
		return this._postsService.createPost(data, author);
	}

	@UseGuards(AccessTokenGuard)
    @Mutation(() => Post)
	public async updatePost(
		@Args('id') id: number,
		@Args('update') data: PostUpdateWithoutAuthorInput,
		@CurrentUser() author: JwtPayload
	) {
		return this._postsService.updatePost(id, data, author);
	}
}