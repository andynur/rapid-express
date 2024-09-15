import { UserInfo } from '@/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserInfo; // Tambahkan properti user di tipe Request
    }
  }
}
