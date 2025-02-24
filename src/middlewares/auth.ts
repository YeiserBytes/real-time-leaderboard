import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types";

declare global {
	namespace Express {
		interface Request {
			userId: number;
		}
	}
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not configured");
		}

		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({
				success: false,
				message: "Authorization header is required"
			});
			return;
		}

		const token = extractToken(authHeader);
		if (!token) {
			res.status(401).json({
				success: false,
				message: "Valid token is required"
			});
			return;
		}

		const decoded = verifyToken(token);
		req.userId = decoded.userId;

		next();
	} catch (error) {
		handleAuthError(error, res);
	}
};

function extractToken(authHeader: string): string | null {
	return authHeader.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: authHeader;
}

function verifyToken(token: string): JwtPayload {
	if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

function handleAuthError(error: unknown, res: Response) {
	if (error instanceof jwt.JsonWebTokenError) {
		return res.status(401).json({
			success: false,
			message: `Invalid token: ${error.message}`
		});
	}

	return res.status(500).json({
		success: false,
		message: "Internal server error"
	});
}
