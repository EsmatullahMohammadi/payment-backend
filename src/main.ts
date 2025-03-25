import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { json, urlencoded, raw } from 'express';

// Extend Request type to include rawBody
declare module 'express' {
  interface Request {
    rawBody?: Buffer; // Ensure rawBody is available
  }
}

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const configService = app.get(ConfigService);

  // Get Stripe secret key safely
  const stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY');

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is missing. Check your .env file.');
  }

  // ✅ Ensure that ONLY the webhook route gets the raw body
  app.use(
    '/payment/webhook',
    raw({ type: 'application/json' }),
    (req, res, next) => {
      req.rawBody = req.body; // Attach raw body manually
      next();
    }
  );

  // ✅ Use JSON and URL-encoded parsers for all other routes
  app.use(json());
  app.use(urlencoded({ extended: true }));

  await app.listen(3000);
}

bootstrap();
