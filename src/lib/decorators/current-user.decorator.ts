import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
	(_data: unknown, context: ExecutionContextHost) => {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req.user;
	}
);
