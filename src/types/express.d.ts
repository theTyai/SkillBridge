import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        supabaseAuthId: string;
        email: string;
        role: UserRole;
        institutionId: string | null;
        organizationId: string | null;
      };
    }
  }
}
