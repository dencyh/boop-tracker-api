import { Project } from "./Project";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Bug {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  priority: string;

  @Column()
  due: Date;

  @Column()
  assigned_to: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.bugs)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.bugs)
  @JoinColumn({
    name: "project_id",
  })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
