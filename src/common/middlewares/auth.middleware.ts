import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;

    if (!token) {
      return res.status(401).json({
        message: "Accès refusé : header 'auth-user' manquant",
      });
    }

    try {
      const decoded: any = verify(token, 'secret');

      if (!decoded || !decoded.userId) {
        return res.status(401).json({
          message: "Accès refusé : la propriété 'userId' est absente du token",
        });
      }

      (req as any).userId = decoded.userId;
      next();
    } catch {
      return res.status(401).json({
        message: 'Accès refusé : token invalide',
      });
    }
  }
}