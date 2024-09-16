import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ProductService } from '@services/product.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateProductDto } from '@dtos/product.dto';
import redis from '@/config/redis';

export class ProductController {
  private productService = Container.get(ProductService);
  private cacheKey = 'products';

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = 'Products retrieved successfully';

      // Check cache first
      const cachedProducts = await redis.get(this.cacheKey);
      if (cachedProducts) {
        apiResponseOk(res, message, JSON.parse(cachedProducts));
      }

      // If no cache, query database
      const products = await this.productService.findAllProducts();
      // Store the result in Redis cache with an expiry time (e.g., 1 hour = 3600 seconds)
      await redis.set(this.cacheKey, JSON.stringify(products), 'EX', 3600); // 'EX' sets the expiration time

      apiResponseOk(res, message, products);
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData = req.body as CreateProductDto;
      const newProduct = await this.productService.createProduct(productData);

      await redis.del(this.cacheKey); // clears products cache

      apiResponseCreated(res, 'Product created successfully', newProduct);
    } catch (error) {
      next(error);
    }
  };
}
