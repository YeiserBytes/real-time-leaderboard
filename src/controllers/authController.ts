import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Aquí deberías agregar la lógica para guardar en tu base de datos
      // Por ahora solo retornamos un mensaje de éxito
      const hashedPassword = await bcrypt.hash(password, 10);

      res.status(201).json({
        message: 'User registered successfully',
        user: { username, email }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Aquí deberías verificar las credenciales contra tu base de datos
      // Por ahora generamos un token de prueba
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
}
