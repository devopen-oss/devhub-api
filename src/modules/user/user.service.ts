import { PermissionsBitField } from '#lib/constants';
import type { PaginationArgs } from '#lib/graphql/common/pagination/pagination.args';
import type { UsersConnection } from '#lib/graphql/objects/pages';
import {
	type PrismaFindManyArguments,
	findManyCursorConnection
} from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
// import type { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
	private readonly _permissions = PermissionsBitField;

	public constructor(private readonly _prismaService: PrismaService) {}

	public async checkUserPermissions(
		userId: number,
		permissions: number[]
	): Promise<boolean> {
		const user = await this._prismaService.user.findUniqueOrThrow({
			where: { id: userId },
			select: { permissions: true }
		});

		return this._permissions.any(user.permissions, permissions);
	}
	public async getUsers(
		{ first, last, before, after }: PaginationArgs //
	): Promise<UsersConnection> {
		// TODO: filters
		// const where: Prisma.UserWhereInput = {};

		return findManyCursorConnection(
			(args: PrismaFindManyArguments<{ id: number }>) =>
				this._prismaService.user.findMany({
					include: { sessions: false },
					// where,
					...args
				}),
			() =>
				this._prismaService.user.count({
					//where
				}),
			{ first, last, before, after }
		);
	}
}
