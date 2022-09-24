import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Bug } from './entity/Bug';
import { Comment } from './entity/Comment';
import { Project } from './entity/Project';
import { Token } from './entity/Token';
import { User } from './entity/User';

export const db = new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env.DATABASE_PORT, 10),
	username: 'postgres',
	password: 'root',
	database: 'boop-tracker',
	synchronize: true,
	logging: false,
	entities: [User, Bug, Project, Comment, Token],
	migrations: [],
	subscribers: [],
});
