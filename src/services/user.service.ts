import { Service, Inject } from 'typedi';
import { CreateUserDto } from '@dtos/user.dto';
import { HttpException } from '@exceptions/HttpException';
import { hash } from 'bcrypt';
import { UserRepository } from '@repositories/user.repository';
import { UserEntity } from '@/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserInfo } from '@/interfaces/user.interface';

@Service()
export class UserService {
  constructor(@Inject(() => UserRepository) private userRepository: UserRepository) {}

  public async findAllUser(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => {
      return plainToInstance(UserEntity, user);
    });
  }

  public async findUserById(userId: number): Promise<UserEntity> {
    const findUser = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    return plainToInstance(UserEntity, findUser);
  }

  public async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const findUser = await this.userRepository.findByEmail(userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return plainToInstance(UserEntity, createUserData);
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<UserEntity> {
    const findUser = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    // update password when exist
    if (userData.password !== undefined) {
      const hashedPassword = await hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    // check another email to prevent unique constraint
    if (userData.email !== undefined && userData.email !== findUser.email) {
      const checkUser = await this.userRepository.findByEmail(userData.email);
      if (checkUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    const updateUserData = await this.userRepository.update(userId, { ...userData });
    return plainToInstance(UserEntity, updateUserData);
  }

  public async deleteUser(userInfo: UserInfo, userId: number): Promise<void> {
    const findUser = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    // can't delete self id
    if (findUser.id === userInfo.id) {
      throw new HttpException(403, 'Self-account deletion is restricted');
    }

    this.userRepository.delete(userId);
  }
}
