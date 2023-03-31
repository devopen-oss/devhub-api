import { User } from '@generated/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Application access tokens.' })
export class AuthTokensObject {
	@Field(() => String, { description: "Access token for the user's use in the application." })
	public access_token!: string;

	@Field(() => String, { description: 'Refresh token to obtain a new token to access the application.' })
	public refresh_token!: string;

	@Field(() => Number, { description: 'Time in milliseconds when the access token will expire.' })
	public expires_in!: number;
}

@ObjectType()
export class AuthUserInforObject {}

@ObjectType({ description: 'Github information about the user obtained through the access token.' })
export class AuthUserObject {
	@Field(() => AuthUserInforObject, { description: 'User github information' })
	public auth!: AuthUserInforObject;

	@Field(() => User, { description: 'User platform information' })
	public user!: User;
}
