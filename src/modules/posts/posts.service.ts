import { PermissionFlags } from '#lib/constants';
import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';
import { UserService } from '#modules/user/user.service';
import type {
	PostCreateWithoutAuthorInput,
	PostStatus,
	PostUpdateWithoutAuthorInput
} from '#root/@generated';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
	public constructor(
		private readonly _prismaService: PrismaService,
		private readonly _userService: UserService
	) {}

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
