import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";

@Entity()
class User {
	@PrimaryGeneratedColumn()
	id!: number;
	@Column()
	username!: string;
	@Column()
	password!: string;
	@CreateDateColumn()
	createdAt!: Date;
	@OneToMany(
		() => Score,
		(score) => score.user,
	)
	scores!: Score[];
}

@Entity()
class Game {
	@PrimaryGeneratedColumn()
	id!: number;
	@Column()
	name!: string;
	@Column()
	description!: string;
	@CreateDateColumn()
	createdAt!: Date;
	@OneToMany(
		() => Score,
		(score) => score.gameId,
	)
	scores!: Score[];
}

@Entity()
class Score {
	@PrimaryGeneratedColumn()
	id!: number;
	@Column()
	gameId!: number;
	@Column("float")
	score!: number;
	@CreateDateColumn()
	createdAt!: Date;
	@ManyToOne(
		() => User,
		(user) => user.scores,
	)
	user!: User;
}

export { User, Game, Score };
