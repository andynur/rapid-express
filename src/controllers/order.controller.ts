import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OrderService } from '@services/order.service';
import { apiResponseOk, apiResponseCreated, apiResponseBadRequest } from '@utils/apiResponse';
import { CreateOrderDto, OrderListQueryDto, UpdateOrderDto } from '@dtos/order.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class OrderController {
  private orderService = Container.get(OrderService);

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Transform and validate query parameters
      const queryParams = plainToInstance(OrderListQueryDto, req.query);
      const errors = await validate(queryParams);
      if (errors.length > 0) {
        apiResponseBadRequest(res, 'Invalid query parameters');
      }

      const { orders, meta } = await this.orderService.findAllOrders(queryParams);
      apiResponseOk(res, 'Orders retrieved successfully', orders, meta);
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const order = await this.orderService.findOrderById(orderId);
      apiResponseOk(res, 'Order retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData = req.body as CreateOrderDto;
      // Check for duplicate product IDs
      if (this.checkDuplicateProductId(orderData)) {
        apiResponseBadRequest(res, 'Duplicate product IDs are not allowed');
      }

      const newOrder = await this.orderService.createOrder(orderData);
      apiResponseCreated(res, 'Order created successfully', newOrder);
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const orderData = req.body as UpdateOrderDto;
      // Check for duplicate product IDs
      if (this.checkDuplicateProductId(orderData)) {
        apiResponseBadRequest(res, 'Duplicate product IDs are not allowed');
      }

      const updatedOrder = await this.orderService.updateOrder(orderId, orderData);
      apiResponseOk(res, 'Order updated successfully', updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      await this.orderService.deleteOrder(orderId);
      apiResponseOk(res, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  private checkDuplicateProductId(orderData: CreateOrderDto | UpdateOrderDto) {
    const productIds = orderData.products.map(p => p.product_id);
    const uniqueProductIds = new Set(productIds);
    return productIds.length !== uniqueProductIds.size;
  }
}
