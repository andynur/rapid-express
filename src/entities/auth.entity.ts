import { Exclude, Expose } from 'class-transformer';

export class AuthEntity {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  token: string;

  @Expose()
  expires_in: string;

  @Exclude()
  password: string;
}
