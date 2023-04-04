import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Validation
	app.useGlobalPipes(new ValidationPipe());

	// enable shutdown hook
	const prismaService: PrismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	// Prisma Client Exception Filter for unhandled exceptions
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	await app.listen(process.env.API_PORT ?? 3000);
}

bootstrap().catch(console.error);
