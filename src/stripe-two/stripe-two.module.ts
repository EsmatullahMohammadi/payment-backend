import { Module } from '@nestjs/common';
import { StripeTwoService } from './stripe-two.service';
import { StripeTwoController } from './stripe-two.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User])],
  controllers: [StripeTwoController],
  providers: [StripeTwoService],
})
export class StripeTwoModule {}
