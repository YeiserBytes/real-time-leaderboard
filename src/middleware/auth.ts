import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: unknown
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).send({ error: 'No token provided' })
    }

    const token = authHeader?.split(" ")[1]
    const decoded = jwt.verify(token || "", JWT_SECRET || "default_secret")

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' })
  }
}
