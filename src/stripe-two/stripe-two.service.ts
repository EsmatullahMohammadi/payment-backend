
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeTwoService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is missing in environment variables.');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async createCheckoutSession(amount: number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Craft App plan 1' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:4200/payment-two?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:4200/subscription',
    });

    return { sessionUrl: session.url };
  }

  // ✅ Construct Event for Webhook
  constructEvent(payload: Buffer, signature: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  // ✅ Save Payment Data to Database
  async savePayment(session: Stripe.Checkout.Session) {
    console.log('✅ Payment successful! Saving data to database...');

    // Replace with actual database logic (TypeORM, Prisma, etc.)
    const paymentData = {
      sessionId: session.id,
      email: session.customer_details?.email,
      amountPaid: session.amount_total ? session.amount_total / 100 : 0, // Convert cents to dollars
      currency: session.currency,
      status: session.payment_status,
    };

    // Example: Save to database (replace with your database logic)
    console.log('Saving payment:', paymentData);
    
    // Here you can call your database service to save the paymentData
  }
}
