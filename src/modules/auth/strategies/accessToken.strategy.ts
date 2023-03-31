import { AuthService } from '../auth.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import type { AuthGithubUser } from '../types/github';
import type { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';

export interface JwtPayload {
	id: number;
	access_token: string;
	token_type: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	public cachedVerificationTokens = new Map<
		string,
		{
			expires_in: number;
			success: boolean;
			user: Partial<AuthGithubUser>;
		}
	>();

	public constructor(
		private readonly _authService: AuthService,
		public readonly _configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: _configService.get('JWT_SECRET'),
			passReqToCallback: true
		} as StrategyOptions);
	}

	public async validate(req: Request, payload: JwtPayload) {
		const token = req.get('Authorization')?.replace('Bearer ', '').trim();
		if (!token) {
			throw new UnauthorizedException(
				'Please make sure that you are providing a valid access token.'
			);
		}

		const session = await this._authService.checkSession(token, payload.id);
		if (!session) {
			throw new UnauthorizedException();
		}

		const cache = this.cachedVerificationTokens.get(token);

		if (cache && !cache.success) throw new UnauthorizedException();
		if (cache && Date.now() < cache.expires_in && cache.success)
			return {
				...payload,
				...cache.user,
				app: { access_token: token }
			};

		if ((cache && Date.now() > cache.expires_in) || !cache) {
			const userData = await this.fetchData(payload);
			this.cachedVerificationTokens.set(token, {
				expires_in: Date.now() + 1000 * 60 * 60,
				success: true,
				user: userData.auth
			});
			return {
				...payload,
				...userData.auth,
				app: { access_token: token }
			};
		}

		throw new UnauthorizedException();
	}

	private async fetchData(payload: JwtPayload) {
		const userData = await this._authService.user(payload);
		if (!userData) throw new UnauthorizedException();
		return userData;
	}
}
