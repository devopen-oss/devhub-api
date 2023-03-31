import type { JwtPayload } from './strategies/accessToken.strategy';
import type { AuthGithubUser, OAuthDataGithub } from './types/github';

import { HttpService } from '@nestjs/axios';
import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';

import argon from 'argon2';
import { PrismaService } from 'nestjs-prisma';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	public constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService,
		private readonly _jwtService: JwtService,
		private readonly _prismaService: PrismaService
	) {}

	public async tokens(code: string) {
		const oauthData = await lastValueFrom(
			this._httpService.post<OAuthDataGithub>(
				'https://github.com/login/oauth/access_token',
				{
					client_id: this._configService.getOrThrow('GH_CLIENT_ID'),
					client_secret: this._configService.getOrThrow('GH_CLIENT_SECRET'),
					code,
					redirect_uri: this._configService.getOrThrow('GH_CLIENT_REDIRECT_URI')
				},
				{
					headers: {
						Accept: 'application/json'
					}
				}
			)
		).catch(() => {
			throw new BadRequestException(
				'An error ocurred while trying to get the data from Github.'
			);
		});

		const userData = await lastValueFrom(
			this._httpService.get<AuthGithubUser>('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${oauthData.data.access_token}`
				}
			})
		).catch(() => {
			throw new BadRequestException(
				'There was an error obtaining your user information, please log in again.'
			);
		});

		const accessToken = await this._jwtService.signAsync({
			id: userData.data.id,
			access_token: oauthData.data.access_token,
			token_type: oauthData.data.token_type
		} as JwtPayload);

		await this._prismaService.session.create({
			data: {
				accessToken: await argon.hash(accessToken),
				user: {
					connectOrCreate: {
						where: {
							id: userData.data.id
						},
						create: {
							id: userData.data.id,
							name: userData.data.name,
							email: userData.data.email
						}
					}
				}
			}
		});
	}

	public async user(
		user: JwtPayload
	): Promise<{ auth: AuthGithubUser; user: User }> {
		const authData = await lastValueFrom(
			this._httpService.get<{ user: AuthGithubUser }>(
				'https://api.github.com/user',
				{
					headers: { Authorization: `Bearer ${user.access_token}` }
				}
			)
		).catch(() => {
			throw new UnauthorizedException(
				'Your user information could not be obtained, you are probably not logged in or your session has expired.'
			);
		});

		const userData = await this._prismaService.user
			.findUniqueOrThrow({
				where: { id: user.id }
			})
			.catch(() => {
				throw new BadRequestException(
					'No information about your user could be found on the platform.'
				);
			});

		return { auth: authData.data.user, user: userData };
	}

	public async checkSession(token: string, userId: number) {
		const session = await this._prismaService.session.findMany({
			where: { userId }
		});

		if (!session.length) return false;
		return session.some((s) => argon.verify(s['accessToken'], token));
	}
}
