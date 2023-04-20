import { PaginationArgs } from '#lib/graphql/common/pagination/pagination.args';
import { UsersConnection } from '#lib/graphql/objects/pages';
import { UserService } from './user.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
	public constructor(private readonly _userService: UserService) {}

	@Query(() => UsersConnection)
	public async users(
		@Args() paginated: PaginationArgs
	) {
		return this._userService.getUsers(paginated);
	}
}
