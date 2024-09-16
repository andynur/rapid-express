import { PrismaClient, Customer } from '@prisma/client';
import { Service } from 'typedi';
import { CreateCustomerDto } from '@dtos/customer.dto';

@Service()
export class CustomerRepository {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  public async findById(customerId: number): Promise<{ id: number }> {
    return this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
      },
    });
  }

  public async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }
}
