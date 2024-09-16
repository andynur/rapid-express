import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OrderService } from '@services/order.service';
import { apiResponseOk, apiResponseCreated, apiResponseBadRequest } from '@utils/apiResponse';
import { CreateOrderDto, OrderListQueryDto, UpdateOrderDto } from '@dtos/order.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import redis from '@/config/redis';
import { ToSnakeCase } from '@/utils/stringManipulation';
import { PaginationMeta } from '@/interfaces/pagination.interface';
import { OrderEntity } from '@/entities/order.entity';

export class OrderController {
  private orderService = Container.get(OrderService);
  private cacheKey = 'orders';

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = 'Orders retrieved successfully';

      // Transform and validate query parameters
      const queryParams = plainToInstance(OrderListQueryDto, req.query);
      const errors = await validate(queryParams);
      if (errors.length > 0) {
        apiResponseBadRequest(res, 'Invalid query parameters');
      }

      // Generate custom cache key
      const customCacheKey = this.cacheKeyByQuery(queryParams);

      // Check if data exists in Redis cache
      const cachedOrders = await redis.get(customCacheKey);
      if (cachedOrders) {
        const cachedData = JSON.parse(cachedOrders) as { data: OrderEntity[]; meta: PaginationMeta };
        apiResponseOk(res, message, cachedData.data, cachedData.meta);
      }

      // If no cache, query the database
      const { data, meta } = await this.orderService.findAllOrders(queryParams);
      // Store the result in Redis cache with an expiry time (e.g., 1 hour)
      await redis.set(customCacheKey, JSON.stringify({ data, meta }), 'EX', 3600);

      apiResponseOk(res, message, data, meta);
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const message = 'Order detail retrieved successfully';

      // Check cache first
      const cachedOrderDetail = await redis.get(`order_${orderId}`);
      if (cachedOrderDetail) {
        apiResponseOk(res, message, JSON.parse(cachedOrderDetail));
      }

      // If no cache, query database
      const order = await this.orderService.findOrderById(orderId);

      // Store the result in Redis cache with an expiry time (e.g., 1 hour = 3600 seconds)
      await redis.set(`${this.cacheKey}_${orderId}`, JSON.stringify(order), 'EX', 3600);

      apiResponseOk(res, message, order);
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData = req.body as CreateOrderDto;
      const newOrder = await this.orderService.createOrder(orderData);

      // clears orders cache
      await this.clearOrdersCache();

      apiResponseCreated(res, 'Order created successfully', newOrder);
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const orderData = req.body as UpdateOrderDto;
      const updatedOrder = await this.orderService.updateOrder(orderId, orderData);

      // clears orders cache
      await redis.del(`${this.cacheKey}_${orderId}`);
      await this.clearOrdersCache();

      apiResponseOk(res, 'Order updated successfully', updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      await this.orderService.deleteOrder(orderId);

      // clears orders cache
      await redis.del(`${this.cacheKey}_${orderId}`);
      await this.clearOrdersCache();

      apiResponseOk(res, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  private cacheKeyByQuery(query: OrderListQueryDto): string {
    const dateRangeKey = ToSnakeCase(query.start_date ? query.start_date + '_' + query.end_date : 'all_date');
    const sortKey = ToSnakeCase(query.sort_by ? query.sort_by + '_' + query.sort_order : 'default');
    const customerKey = ToSnakeCase(query.customer || 'all');

    return `${this.cacheKey}:${customerKey}:${dateRangeKey}:page_${query.page}:limit_${query.limit}:sort_${sortKey}`;
  }

  // Method to clear cache for a specific customer or all orders
  private async clearOrdersCache() {
    try {
      const keys = await redis.keys(`${this.cacheKey}:*`); // Get all keys with 'orders' prefix
      if (keys.length > 0) {
        await redis.del(...keys); // Delete all matching keys
        console.log('All orders cache cleared');
      }
    } catch (error) {
      console.error('Error clearing orders cache:', error);
    }
  }
}
