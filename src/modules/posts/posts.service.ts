import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';
import type {
	PostCreateWithoutAuthorInput,
	PostUpdateWithoutAuthorInput
} from '#root/@generated';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
	public constructor(private readonly _prismaService: PrismaService) {}

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
		await this._getUserPost(id, author.id).catch(() => {
			// TODO: check if the user has permissions to update the post
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
		await this._getUserPost(id, author.id).catch(() => {
			// TODO: check if the user has permissions to delete the post
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

	private async _getUserPost(id: number, userId: number) {
		return this._prismaService.post.findMany({
			where: {
				id,
				userId
			}
		});
	}
}
