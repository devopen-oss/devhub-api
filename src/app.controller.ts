import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	public constructor(private readonly appService: AppService) {}

	@Get()
	public getHello(): string {
		return this.appService.getHello();
	}
}
