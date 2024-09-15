import { CreateUserDto } from '@/dtos/user.dto';
import { PrismaClient, User } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class UserRepository {
  private prisma = new PrismaClient();

  public async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async findById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  public async update(userId: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  public async delete(userId: number): Promise<User> {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}
