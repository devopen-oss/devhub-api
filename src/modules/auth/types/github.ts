export interface OAuthDataGithub {
	access_token: string;
	scope: string;
	token_type: string;
}

export interface AuthGithubUser {
	login: string;
	id: number;
	avatar_url: string;
	gravatar_id: string;
	type: string;
	name: string;
	email: string;
	bio: string;
}
