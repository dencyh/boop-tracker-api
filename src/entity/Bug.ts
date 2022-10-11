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
  ManyToMany,
  JoinTable,
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User)
  @JoinTable()
  assigned_to: User[];

  @ManyToOne(() => User, (user) => user.created_bugs)
  @JoinColumn({
    name: "created_by",
  })
  created_by: User;

  @ManyToOne(() => Project, (project) => project.bugs)
  @JoinColumn({
    name: "project_id",
  })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.bug)
  comments: Comment[];
}
