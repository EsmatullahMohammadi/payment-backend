import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
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

  async createPaymentIntent(amount: number, currency: string) {
    let respons = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'], 
    });
    return respons;
  }
}

