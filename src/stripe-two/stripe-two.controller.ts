import { Controller, Post, Body } from '@nestjs/common';
import { StripeTwoService } from './stripe-two.service';

@Controller('payment')
export class StripeTwoController {
  constructor(private readonly stripeService: StripeTwoService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { amount: number }) {
    const session = await this.stripeService.createCheckoutSession(data.amount);
    return { sessionUrl: session.sessionUrl };
  }
}
