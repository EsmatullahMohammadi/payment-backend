import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { StripeTwoService } from './stripe-two.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

interface RawRequest extends Request {
  rawBody: Buffer;
}


@Controller('payment')
export class StripeTwoController {
  constructor(private readonly stripeService: StripeTwoService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { amount: number; plan: string }) {
    const session = await this.stripeService.createCheckoutSession(data.amount, data.plan);
    return { sessionUrl: session.sessionUrl };
  }

  @Post('verify-payment')
  async verifyPayment(@Body() data: { sessionId: string }) {
    const success = await this.stripeService.verifyPayment(data.sessionId);
    return { success };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,  // No need for RawRequest anymore
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
  
    console.log("Webhook received:", req.body, req.rawBody?.toString()); // Debugging
  
    try {
      event = this.stripeService.constructEvent(
        req.rawBody,  // This should be a Buffer
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.stripeService.savePayment(session);
    }
  
    return res.json({ received: true });
  }
  
  
  
}
