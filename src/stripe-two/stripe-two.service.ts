import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { User } from 'src/entities/user.entity';

@Injectable()
export class StripeTwoService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is missing in environment variables.');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async createCheckoutSession(amount: number, plan: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',  // This should be 'payment' for one-time payments
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
  

  //  Construct Event for Webhook
  constructEvent(payload: any, signature: string, secret: string) {
    return this.stripe.webhooks.constructEvent(
      Buffer.from(payload), // Ensure it's a Buffer
      signature,
      secret
    );
  }
  

  //  Save Payment Data to Database
  async savePayment(session: Stripe.Checkout.Session) {
    console.log('Payment successful! Saving data to database...');
  
    const email = session.customer_details?.email;
    const stripeCustomerId = session.customer as string | null; //  Ensure it's a string or null
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0; // Convert cents to dollars
  
    if (!email) {
      console.error('Error: No email provided in Stripe session.');
      return;
    }
  
    // Check if the user already exists
    let user = await this.userRepository.findOne({ where: { email } });
  
    if (user) {
      console.log(' Existing user found, updating plan...');
      user.plan = 'premium'; // 
      user.stripeCustomerId = stripeCustomerId;
    } else {
      console.log(' New user, creating record...');
      user = this.userRepository.create({
        email,
        stripeCustomerId,
        plan: 'premium', // Assign correct plan
      });
    }
  
    await this.userRepository.save(user);
    // console.log(' User saved successfully:', user);
  }

  async verifyPayment(sessionId: string): Promise<boolean> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      await this.savePayment(session);
      return true;
    }
    return false;
  }
  
  
}
