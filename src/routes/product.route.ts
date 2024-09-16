import { Router } from 'express';
import { ProductController } from '@controllers/product.controller';
import { CreateProductDto } from '@dtos/product.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.product.getProducts);
    this.router.post(`${this.path}`, [AuthMiddleware, ValidationMiddleware(CreateProductDto)], this.product.createProduct);
  }
}
