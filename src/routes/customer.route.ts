import { Router } from 'express';
import { CustomerController } from '@controllers/customer.controller';
import { CreateCustomerDto } from '@dtos/customer.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class CustomerRoute implements Routes {
  public path = '/customers';
  public router = Router();
  public customer = new CustomerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.customer.getCustomers);
    this.router.post(`${this.path}`, [AuthMiddleware, ValidationMiddleware(CreateCustomerDto)], this.customer.createCustomer);
  }
}
