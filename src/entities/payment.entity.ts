import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: string;

  @Column()
  email: string;

  @Column()
  amountPaid: number;

  @Column()
  currency: string;

  @Column()
  status: string;
}
