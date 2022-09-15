import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entity/User";

export const db = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "boop-tracker",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
