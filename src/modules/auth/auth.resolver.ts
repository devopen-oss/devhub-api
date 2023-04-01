import { CurrentUser } from '#lib/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access.guard';
import { AuthTokensObject, AuthUserObject } from './objects/auth';
import type { JwtPayload } from './strategies/accessToken.strategy';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Auth')
export class AuthResolver {
	public constructor(private readonly _authService: AuthService) {}

	@Query(() => AuthUserObject, { description: 'Get the current user' })
    @UseGuards(AccessTokenGuard)
	public me(@CurrentUser() user: JwtPayload) {
		return this._authService.user(user);
	}

	@Mutation(() => AuthTokensObject)
	public async token(
		@Args('code', { description: 'Github OAuth code' }) code: string
	) {
		return this._authService.tokens(code);
	}
}
