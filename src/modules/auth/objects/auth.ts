import type { AuthGithubUser } from '../types/github';
import { User } from '@generated/user';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Application access tokens.' })
export class AuthTokensObject {
	@Field(() => String, { description: "Access token for the user's use in the application." })
	public access_token!: string;
}

@ObjectType()
export class AuthUserInforObject implements AuthGithubUser {
	@Field(() => ID, { description: 'User id.' })
	public id!: number;

	@Field(() => String, { description: 'User username.' })
	public login!: string;

	@Field(() => String, { description: 'User avatar.' })
	public avatar_url!: string;

	@Field(() => String, { description: 'User gravatar.' })
	public gravatar_id!: string;

	@Field(() => String, { description: 'If de auth was done on a team or user.' })
	public type!: string;

	@Field(() => String, { description: 'User name.' })
	public name!: string;

	@Field(() => String, { description: 'User email.', nullable: true })
	public email!: string;

	@Field(() => String, { description: 'User biography.' })
	public bio!: string;
}

@ObjectType({ description: 'Github information about the user obtained through the access token.' })
export class AuthUserObject {
	@Field(() => AuthUserInforObject, { description: 'User github information' })
	public auth!: AuthUserInforObject;

	@Field(() => User, { description: 'User platform information' })
	public user!: User;
}
