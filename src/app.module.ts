import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { StripeTwoModule } from './stripe-two/stripe-two.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { pgConfig } from 'dbConfig';
@Module({
  imports: [StripeModule, 
    ConfigModule.forRoot(), StripeTwoModule,
    TypeOrmModule.forRoot(pgConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
