import type { Request, Response } from "express";
import { AppDataSource } from "../config";
import { User } from "../entities/Entities";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { UserInput } from "../types";

export class UserController {
	private userRepository = AppDataSource.getRepository(User);
	private readonly JWT_SECRET = process.env.JWT_SECRET || "secret";

	// GET /api/users
	async getAllUsers(_req: Request, res: Response): Promise<void> {
		try {
			const users = await this.userRepository.find();
			const sanitizedUsers = users.map(({ password, ...user }) => user);
			res.status(200).json(sanitizedUsers);
		} catch (error) {
			console.error('Error fetching users:', error);
			res.status(500).json({ message: "Failed to fetch users" });
		}
	}

	// POST /api/register
	async register(req: Request, res: Response): Promise<void> {
		try {
			const { username, password } = req.body as UserInput;

			if (!username || !password) {
				res.status(400).json({ message: "Username and password are required" });
				return;
			}

			if (password.length < 6) {
				res.status(400).json({ message: "Password must be at least 6 characters" });
				return;
			}

			const existingUser = await this.userRepository.findOne({
				where: { username },
			});

			if (existingUser) {
				res.status(400).json({ message: "User already exists" });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = this.userRepository.create({
				username,
				password: hashedPassword,
			});

			await this.userRepository.save(user);

			const token = jwt.sign(
				{ userId: user.id },
				this.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			res.status(201).json({
				message: "User registered successfully",
				id: user.id,
				username: user.username,
				token,
			});
		} catch (error) {
			console.error('Error registering user:', error);
			res.status(500).json({ message: "Failed to register user" });
		}
	}

	// POST /api/login
	async login(req: Request<unknown, unknown, UserInput>, res: Response): Promise<void> {
		try {
			const { username, password } = req.body as UserInput;

			if (!username || !password) {
				res.status(400).json({ message: "Username and password are required" });
				return;
			}

			const user = await this.userRepository.findOne({
				where: { username },
			});

			if (!user) {
				res.status(401).json({ message: "Invalid credentials" });
				return;
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				res.status(401).json({ message: "Invalid credentials" });
				return;
			}

			const token = jwt.sign(
				{ userId: user.id },
				this.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			res.status(200).json({ id: user.id, username: user.username, token });
		} catch (error) {
			console.error('Error logging in:', error);
			res.status(500).json({ message: "Failed to login" });
		}
	}

	// DELETE /api/user/:userId
	async deleteUser(req: Request<{ userId: string }>, res: Response): Promise<void> {
		try {
			const userId = Number.parseInt(req.params.userId);

			if (Number.isNaN(userId)) {
				res.status(400).json({ message: "Invalid user ID" });
				return;
			}

			const user = await this.userRepository.findOne({
				where: { id: userId },
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			await this.userRepository.remove(user);
			res.status(200).json({ message: "User deleted successfully" });
		} catch (error) {
			console.error('Error deleting user:', error);
			res.status(500).json({ message: "Failed to delete user" });
		}
	}
}
