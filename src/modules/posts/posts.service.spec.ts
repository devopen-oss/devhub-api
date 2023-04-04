import { PostsService } from './posts.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostsService', () => {
	let service: PostsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PostsService]
		}).compile();

		service = module.get<PostsService>(PostsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
