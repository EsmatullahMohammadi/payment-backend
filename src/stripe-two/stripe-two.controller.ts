import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { StripeTwoService } from './stripe-two.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Controller('payment')
export class StripeTwoController {
  constructor(private readonly stripeService: StripeTwoService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { amount: number }) {
    const session = await this.stripeService.createCheckoutSession(data.amount);
    return { sessionUrl: session.sessionUrl };
  }

  // ✅ Webhook to handle payment status
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    try {
      event = this.stripeService.constructEvent(req.body, signature, 'STRIPE_WEBHOOK_SECRET');
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ Call a function to save payment info to the database
      await this.stripeService.savePayment(session);
    }

    res.json({ received: true });
  }
}
