import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { SignupDto } from '@dtos/signup.dto';
import { LoginDto } from '@dtos/login.dto';
import { HttpException } from '@exceptions/HttpException';
import { UserRepository } from '@repositories/user.repository';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@prisma/client';
import { UserInfo } from '@interfaces/user.interface';
import { AuthEntity } from '@/entities/auth.entity';
import { plainToInstance } from 'class-transformer';

@Service()
export class AuthService {
  constructor(@Inject(() => UserRepository) private userRepository: UserRepository) {}

  public async signup(userData: SignupDto): Promise<{ cookie: string; data: AuthEntity }> {
    const findUser = await this.userRepository.findByEmail(userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    const tokenData = this.createToken(newUser);
    const cookie = this.createCookie(tokenData);
    const data = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: tokenData.token,
      expires_in: tokenData.expiresIn,
    };

    return { cookie, data: plainToInstance(AuthEntity, data) };
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; data: AuthEntity }> {
    const findUser = await this.userRepository.findByEmail(userData.email);
    if (!findUser) throw new HttpException(401, `Invalid email or password. Please try again.`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Invalid email or password. Please try again.');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    const data = {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
      token: tokenData.token,
      expires_in: tokenData.expiresIn,
    };

    return { cookie, data: plainToInstance(AuthEntity, data) };
  }

  public async logout(userData: UserInfo): Promise<User> {
    const findUser: User = await this.userRepository.findById(userData.id);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const currentTimeInMs = Date.now();
    const expiresInMs = currentTimeInMs + 24 * 60 * 60 * 1000; // 24 hour

    return {
      expiresIn: new Date(expiresInMs).toISOString(),
      token: sign(dataStoredInToken, secretKey, { expiresIn: expiresInMs }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
