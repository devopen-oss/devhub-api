import { UserResolver } from './user.resolver';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserResolver', () => {
	let resolver: UserResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserResolver]
		}).compile();

		resolver = module.get<UserResolver>(UserResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
