import { Bug } from "./Bug";
import { User } from "./User";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Bug, (bug) => bug.comments)
  @JoinColumn()
  bug: Bug;
}
