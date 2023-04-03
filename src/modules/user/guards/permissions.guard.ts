import { PermissionFlags, PermissionsBitField } from '#lib/constants';
import {
	BadRequestException,
	type CanActivate,
	type ContextType,
	type ExecutionContext,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

interface RequestAndResponse {
	req: Request;
	res: Response;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
	public constructor(
		private _reflector: Reflector,
		private readonly _prismaService: PrismaService
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const { req } = this.getRequestResponse(context);
		const roles = this._reflector.get<number[]>(
			'permissions',
			context.getHandler()
		);

		if (roles.length === 1 && PermissionFlags.CreatePost === roles[0])
			return true;
		if (!req.user) return false;

		const user = await this._prismaService.user.findFirstOrThrow({
			where: { id: req.user.id }
		});

		if (!user.permissions) return false;
		if (PermissionsBitField.has(user.permissions, roles)) return true;

		return false;
	}

	public getRequestResponse(context: ExecutionContext): RequestAndResponse {
		switch (context.getType<ContextType | 'graphql'>()) {
			case 'http': {
				const ctx = context.switchToHttp();
				return {
					req: ctx.getRequest<Request>(),
					res: ctx.getResponse<Response>()
				};
			}
			case 'graphql':
				return GqlExecutionContext.create(context).getContext();
			default:
				throw new BadRequestException();
		}
	}
}
