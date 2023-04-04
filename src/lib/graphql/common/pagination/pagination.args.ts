import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, { nullable: true })
	public skip?: number;

	@Field(() => String, { nullable: true })
	public after?: string;

	@Field(() => String, { nullable: true })
	public before?: string;

	@Field(() => Int, { nullable: true })
	public first?: number;

	@Field(() => Int, { nullable: true })
	public last?: number;
}
