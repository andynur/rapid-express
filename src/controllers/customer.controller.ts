import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CustomerService } from '@services/customer.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateCustomerDto } from '@dtos/customer.dto';
import redis from '@/config/redis';

export class CustomerController {
  private customerService = Container.get(CustomerService);
  private cacheKey = 'customer';

  public getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = 'Customers retrieved successfully';

      // Check cache first
      const cachedCustomers = await redis.get(this.cacheKey);
      if (cachedCustomers) {
        apiResponseOk(res, message, JSON.parse(cachedCustomers));
      }

      // If no cache, query database
      const customers = await this.customerService.findAllCustomers();
      // Store the result in Redis cache with an expiry time (e.g., 1 hour = 3600 seconds)
      await redis.set(this.cacheKey, JSON.stringify(customers), 'EX', 3600); // 'EX' sets the expiration time

      apiResponseOk(res, message, customers);
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData = req.body as CreateCustomerDto;
      const newCustomer = await this.customerService.createCustomer(customerData);

      await redis.del(this.cacheKey); // clears customers cache

      apiResponseCreated(res, 'Customer created successfully', newCustomer);
    } catch (error) {
      next(error);
    }
  };
}
