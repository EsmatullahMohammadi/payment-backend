
import { Payment } from "src/entities/payment.entity";
import { User } from "src/entities/user.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const pgConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'esmatullah',
    database: 'subcription',
    entities: [User, Payment],
    synchronize: true, // ⚠️ Use only in development! Set to false in production
};
