import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: 'varchar' }) // Allow NULL values
  stripeCustomerId: string | null;

  @Column({ default: 'free' }) // Plan types: free, basic, premium
  plan: string;
}
