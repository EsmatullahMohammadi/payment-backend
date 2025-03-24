import { Module } from '@nestjs/common';
import { StripeTwoService } from './stripe-two.service';
import { StripeTwoController } from './stripe-two.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [StripeTwoController],
  providers: [StripeTwoService],
})
export class StripeTwoModule {}
