import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { Bug } from "./Bug";
import { Stage } from "./Stage";
import { User } from "./User";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: new Date(Date.now()),
  })
  deadline: Date;

  @Column({
    default: false,
  })
  closed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Bug, (bug) => bug.project)
  bugs: Bug[];

  @OneToMany(() => Stage, (stage) => stage.project)
  stages: Stage[];

  @ManyToOne(() => User, (user) => user.createdProjects, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @ManyToMany(() => User, (user) => user.trackingProjects, {
    onDelete: "CASCADE",
  })
  viewers: User[];
}
