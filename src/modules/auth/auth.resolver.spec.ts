import { AuthResolver } from './auth.resolver';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthResolver', () => {
	let resolver: AuthResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthResolver]
		}).compile();

		resolver = module.get<AuthResolver>(AuthResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
