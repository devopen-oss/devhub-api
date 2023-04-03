import type { JwtPayload } from '#modules/auth/strategies/accessToken.strategy';

declare global {
	namespace Express {
		export interface Request {
			user?: User;
		}

		// rome-ignore lint/suspicious/noEmptyInterface: this is the only way to make it work
		export interface User extends JwtPayload {}
	}
}

export default undefined;
