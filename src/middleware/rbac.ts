import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have the required role to perform this action' 
      });
    }

    next();
  };
};

export const requireTenant = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.user.institutionId && !req.user.organizationId && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You must belong to an institution or organization to perform this action' 
      });
    }

    next();
  };
};
