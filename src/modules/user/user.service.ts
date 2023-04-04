import { PermissionsBitField } from '#lib/constants';
import { Injectable } from '@nestjs/common';
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
}
