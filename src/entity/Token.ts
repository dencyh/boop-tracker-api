import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne
} from "typeorm";
import {User} from "./User";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  refreshToken: string;

  @OneToOne(() => User, {eager: true})
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id"
  })
  user: User;
}
