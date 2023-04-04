import { Post } from '#root/@generated';
import { Paginated } from '../common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostsConnection extends Paginated(Post) {}
