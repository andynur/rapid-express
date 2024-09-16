import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CustomerService } from '@services/customer.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateCustomerDto } from '@dtos/customer.dto';

export class CustomerController {
  private customerService = Container.get(CustomerService);

  public getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customers = await this.customerService.findAllCustomers();
      apiResponseOk(res, 'Customers retrieved successfully', customers);
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData = req.body as CreateCustomerDto;
      const newCustomer = await this.customerService.createCustomer(customerData);
      apiResponseCreated(res, 'Customer created successfully', newCustomer);
    } catch (error) {
      next(error);
    }
  };
}
