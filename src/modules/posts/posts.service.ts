import { PermissionFlags } from '#lib/constants';
import type { PaginationArgs } from '#lib/graphql/common/pagination/pagination.args';
import type { PostsConnection } from '#lib/graphql/objects/pages';

import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';
import { UserService } from '#modules/user/user.service';

import {
	type PostCreateWithoutAuthorInput,
	PostStatus,
	type PostUpdateWithoutAuthorInput
} from '#root/@generated';

import {
	type PrismaFindManyArguments,
	findManyCursorConnection
} from '@devoxa/prisma-relay-cursor-connection';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
	public constructor(
		private readonly _prismaService: PrismaService,
		private readonly _userService: UserService
	) {}

	public async getPosts(
		{ first, last, before, after }: PaginationArgs, //
		status: PostStatus = PostStatus.APPROVED
	): Promise<PostsConnection> {
		const where: Prisma.PostWhereInput = {
			status: {
				in: status
			}
		};

		return findManyCursorConnection(
			(args: PrismaFindManyArguments<{ id: number }>) =>
				this._prismaService.post.findMany({
					include: { author: true },
					where,
					...args
				}),
			() =>
				this._prismaService.post.count({
					where
				}),
			{ first, last, before, after }
		);
	}

	public async createPost(
		data: PostCreateWithoutAuthorInput,
		author: JwtPayload
	) {
		return this._prismaService.post.create({
			data: {
				...data,
				author: {
					connect: {
						id: author.id
					}
				}
			}
		});
	}

	public async updatePost(
		id: number,
		data: PostUpdateWithoutAuthorInput,
		author: JwtPayload
	) {
		await this._getUserPost(id, author.id).catch(async () => {
			if (
				await this._userService.checkUserPermissions(author.id, [
					PermissionFlags.ManagePost
				])
			)
				return;

			throw new UnauthorizedException(
				'You are not authorized to update this post.'
			);
		});

		return this._prismaService.post.update({
			where: {
				id
			},
			data
		});
	}

	public async deletePost(id: number, author: JwtPayload) {
		await this._getUserPost(id, author.id).catch(async () => {
			if (
				await this._userService.checkUserPermissions(author.id, [
					PermissionFlags.ManagePost
				])
			)
				return;

			throw new UnauthorizedException(
				'You are not authorized to delete this post.'
			);
		});

		return this._prismaService.post.delete({
			where: {
				id
			}
		});
	}

	public async changePostStatus(id: number, status: PostStatus) {
		return this._prismaService.post.update({
			where: {
				id
			},
			data: {
				status
			}
		});
	}

	private async _getUserPost(id: number, userId: number) {
		return this._prismaService.post.findMany({
			where: {
				id,
				userId
			}
		});
	}
}
