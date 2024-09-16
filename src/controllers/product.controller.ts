import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ProductService } from '@services/product.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateProductDto } from '@dtos/product.dto';

export class ProductController {
  private productService = Container.get(ProductService);

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productService.findAllProducts();
      apiResponseOk(res, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData = req.body as CreateProductDto;
      const newProduct = await this.productService.createProduct(productData);
      apiResponseCreated(res, 'Product created successfully', newProduct);
    } catch (error) {
      next(error);
    }
  };
}
