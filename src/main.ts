import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies if needed
  });

  const configService = app.get(ConfigService);

  // Get the secret key safely
  const stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY');

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is missing. Check your .env file.');
  }

  await app.listen(3000);
}
bootstrap();
