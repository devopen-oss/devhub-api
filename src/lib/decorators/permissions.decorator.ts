import { SetMetadata } from '@nestjs/common';

export const Permissions = (...args: number[]) =>
	SetMetadata('permissions', args);
