import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Picture } from "./entities/Picture";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Picture],
  synchronize: true,
  // logging: true,
});
