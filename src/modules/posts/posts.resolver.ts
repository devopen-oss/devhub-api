import { PermissionFlags } from '#lib/constants';
import { CurrentUser } from '#lib/decorators/current-user.decorator';
import { Permissions } from '#lib/decorators/permissions.decorator';
import { PaginationArgs } from '#lib/graphql/common/pagination/pagination.args';
import { PostsConnection } from '#lib/graphql/objects/pages';

import { AccessTokenGuard } from '#modules/auth/guards/access.guard';
import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';

import {
	Post,
	PostCreateWithoutAuthorInput,
	PostStatus,
	PostUpdateWithoutAuthorInput
} from '#root/@generated';
import { PostsService } from './posts.service';

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PostsResolver {
	public constructor(private readonly _postsService: PostsService) {}

	@Query(() => PostsConnection)
	public async posts(
		@Args() paginated: PaginationArgs,
		@Args({ name: 'status', type: () => PostStatus, nullable: true })
		status?: PostStatus
	) {
		return this._postsService.getPosts(paginated, status);
	}

	@Permissions(PermissionFlags.CreatePost)
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

	@UseGuards(AccessTokenGuard)
    @Mutation(() => Post)
	public async deletePost(
		@Args('id') id: number,
		@CurrentUser() author: JwtPayload
	) {
		return this._postsService.deletePost(id, author);
	}

	@Permissions(PermissionFlags.ManagePost)
    @UseGuards(AccessTokenGuard)
    @Mutation(() => Post)
	public async changePostStatus(
		@Args('id') id: number,
		@Args({
            name: 'status',
            type: () => PostStatus
        }) status: PostStatus
	) {
		return this._postsService.changePostStatus(id, status);
	}
}
