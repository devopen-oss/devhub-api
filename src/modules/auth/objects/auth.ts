import { User } from '@generated/user';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Application access tokens.' })
export class AuthTokensObject {
	@Field(() => String, { description: "Access token for the user's use in the application." })
	public access_token!: string;

	@Field(() => Number, { description: 'Time in milliseconds when the access token will expire.' })
	public expires_in!: number;
}

@ObjectType()
export class AuthUserInforObject {
	@Field(() => ID, { description: 'User id.' })
	public id!: number;
}

@ObjectType({ description: 'Github information about the user obtained through the access token.' })
export class AuthUserObject {
	@Field(() => AuthUserInforObject, { description: 'User github information' })
	public auth!: AuthUserInforObject;

	@Field(() => User, { description: 'User platform information' })
	public user!: User;
}
