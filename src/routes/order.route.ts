import { Router } from 'express';
import { OrderController } from '@controllers/order.controller';
import { CreateOrderDto, UpdateOrderDto } from '@dtos/order.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class OrderRoute implements Routes {
  public path = '/orders';
  public router = Router();
  public order = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.order.getOrders);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware, this.order.getOrderById);
    this.router.post(`${this.path}`, [AuthMiddleware, ValidationMiddleware(CreateOrderDto)], this.order.createOrder);
    this.router.put(`${this.path}/:id(\\d+)`, [AuthMiddleware, ValidationMiddleware(UpdateOrderDto, true)], this.order.updateOrder);
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware, this.order.deleteOrder);
  }
}
