import { Request } from 'express';
import { UserInfo } from '@interfaces/user.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface RequestWithUser extends Request {
  user: UserInfo;
}
