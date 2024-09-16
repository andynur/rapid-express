import { Inject, Service } from 'typedi';
import { CustomerRepository } from '@repositories/customer.repository';
import { CreateCustomerDto } from '@dtos/customer.dto';
import { Customer } from '@prisma/client';

@Service()
export class CustomerService {
  constructor(@Inject(() => CustomerRepository) private customerRepository: CustomerRepository) {}

  public async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  public async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.createCustomer(customerData);
  }
}
