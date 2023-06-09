import { PageInfo } from './page-info.object';
import type { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function Paginated<TItem>(TItemClass: Type<TItem>) {
	@ObjectType(`${TItemClass.name}Edge`)
	abstract class EdgeType {
		@Field(() => String)
		public cursor!: string;

		@Field(() => TItemClass)
		public node!: TItem;
	}

	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({ isAbstract: true })
	abstract class PaginatedType {
		@Field(() => [EdgeType], { nullable: true })
		public edges!: Array<EdgeType>;

		@Field(() => [TItemClass], { nullable: true })
		public nodes!: Array<TItem>;

		@Field(() => PageInfo)
		public pageInfo!: PageInfo;

		@Field(() => Int)
		public totalCount!: number;
	}

	return PaginatedType;
}
