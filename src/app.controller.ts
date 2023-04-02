import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PostStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Controller()
export class AppController {
	public constructor(
		private readonly appService: AppService,
		private readonly _prismaService: PrismaService
	) {}

	@Get("/hello")
	public getHello(): string {
		return this.appService.getHello();
	}

	@Cron("0 0 2 * *") // Every 2 days
	public async handleCron(): Promise<void> {
		const posts = await this._prismaService.post.deleteMany({
			where: {
				status: PostStatus.REJECTED
			}
		});

		console.log(`${posts.count} rejected posts were deleted`);
	}
}
