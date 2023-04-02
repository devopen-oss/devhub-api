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
		await this._prismaService.post
			.findFirstOrThrow({
				where: {
					id,
					userId: author.id
				}
			})
			.catch(() => {
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
}
