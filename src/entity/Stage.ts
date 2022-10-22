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
  OneToOne,
} from "typeorm";

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    default: new Date(),
  })
  from: Date;

  @Column({
    default: new Date(),
  })
  till: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.stages, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  project: Project;

  @OneToOne(() => Stage)
  @JoinColumn()
  next: Stage;
}
