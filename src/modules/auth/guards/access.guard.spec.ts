import { AccessTokenGuard } from './access.guard';

describe('AcessGuard', () => {
	it('should be defined', () => {
		expect(new AccessTokenGuard()).toBeDefined();
	});
});
