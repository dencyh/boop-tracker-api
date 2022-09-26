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
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @ManyToOne(() => Bug, (bug) => bug.comments)
  @JoinColumn({
    name: "bug_id",
  })
  bug: Bug;
}
