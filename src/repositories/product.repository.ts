import { PrismaClient, Product } from '@prisma/client';
import { Service } from 'typedi';
import { CreateProductDto } from '@dtos/product.dto';

@Service()
export class ProductRepository {
  private prisma = new PrismaClient();

  public async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  public async findAllInId(productIds: number[]): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
  }

  public async createProduct(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }
}
