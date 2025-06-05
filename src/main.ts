import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('api');

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('simBro')
    .setDescription('RESTful API for technician scheduling, job tracking, and asset management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const isMcpMode = process.argv.includes('--mcp') || !process.stdin.isTTY;

  if (isMcpMode) {
    await app.init();
    
    process.stdin.resume();
    
    process.on('SIGINT', async () => {
      await app.close();
      process.exit(0);
    });
  } else {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 REST API server running on http://localhost:${port}/api`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
