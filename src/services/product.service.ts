import { Inject, Service } from 'typedi';
import { ProductRepository } from '@repositories/product.repository';
import { CreateProductDto } from '@dtos/product.dto';
import { Product } from '@prisma/client';

@Service()
export class ProductService {
  constructor(@Inject(() => ProductRepository) private productRepository: ProductRepository) {}

  public async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(productData);
  }
}
