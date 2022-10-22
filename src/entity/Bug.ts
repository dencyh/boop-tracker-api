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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  assignedTo: User[];

  @ManyToOne(() => User, (user) => user.createdBugs)
  @JoinColumn({
    name: "createdBy",
  })
  createdBy: User;

  @ManyToOne(() => Project, (project) => project.bugs, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "project_id",
  })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.bug)
  comments: Comment[];
}
