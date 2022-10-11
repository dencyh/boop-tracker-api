import { Bug } from "./Bug";
import { Comment } from "./Comment";
import { Project } from "./Project";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Token } from "./Token";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  firstName: string;

  @Column({})
  lastName: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 100)
  password: string;

  @Column({
    default: false,
  })
  emailConfirmed: boolean;

  @Column({
    default: "",
  })
  confirmationLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Bug, (bug) => bug.createdBy)
  createdBugs: Bug[];

  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @ManyToMany(() => Project)
  @JoinTable()
  trackingProjects: Project[];
}
