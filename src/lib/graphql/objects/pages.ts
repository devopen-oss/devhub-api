import { Post, User } from '#root/@generated';
import { Paginated } from '../common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostsConnection extends Paginated(Post) {}

@ObjectType()
export class UsersConnection extends Paginated(User) {}
