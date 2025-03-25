import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	lastName: string;
}