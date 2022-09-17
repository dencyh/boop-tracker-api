import {Bug} from "./Bug";
import {Comment} from "./Comment";
import {Project} from "./Project";
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
} from "typeorm";
import {IsEmail, Length} from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  first_name: string;

  @Column({})
  last_name: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 100)
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Bug, (bug) => bug.user)
  bugs: Bug[];

  @ManyToMany(() => Project)
  @JoinTable({
    name: "users_projects",
    joinColumn: {
      name: "user",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "project",
      referencedColumnName: "id",
    },
  })
  projects: Project[];
}
