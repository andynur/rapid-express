import { Inject, Service } from 'typedi';
import { OrderRepository } from '@repositories/order.repository';
import { CreateOrderDto, OrderListQueryDto, UpdateOrderDto } from '@dtos/order.dto';
import { Order, OrderItem } from '@prisma/client';
import { PaginationMeta } from '@/interfaces/pagination.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ProductRepository } from '@/repositories/product.repository';
import { CustomerRepository } from '@/repositories/customer.repository';

@Service()
export class OrderService {
  constructor(
    @Inject(() => OrderRepository) private orderRepository: OrderRepository,
    @Inject(() => ProductRepository) private productRepository: ProductRepository,
    @Inject(() => CustomerRepository) private customerRepository: CustomerRepository,
  ) {}

  public async findAllOrders(query: OrderListQueryDto): Promise<{ orders: Order[]; meta: PaginationMeta }> {
    const { customer, start_date, end_date, page, limit, sort_by, sort_order } = query;

    // Get orders and the total count of orders for pagination
    const { orders, totalItems } = await this.orderRepository.findAll(customer, start_date, end_date, page, limit, sort_by, sort_order);

    // Calculate meta information
    const last_page = Math.ceil(totalItems / limit);
    const meta: PaginationMeta = {
      current_page: page,
      per_page: limit,
      total: totalItems,
      last_page: last_page,
    };

    return { orders, meta };
  }

  public async findOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findDetailById(orderId);
    if (!order) throw new HttpException(404, "Order doesn't exist");
    return order;
  }

  public async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // Check customer id
    const checkCustomer = await this.customerRepository.findById(orderData.customer_id);
    if (!checkCustomer) throw new HttpException(404, "Customer doesn't exist");

    const { orderItems, totalPrice } = await this.validateProducts(orderData);
    return this.orderRepository.createOrder(orderItems, totalPrice, orderData.customer_id);
  }

  public async updateOrder(orderId: number, orderData: UpdateOrderDto): Promise<Order> {
    const findOrder = await this.orderRepository.findById(orderId);
    if (!findOrder) throw new HttpException(404, "Order doesn't exist");

    const { orderItems, totalPrice } = await this.validateProducts(orderData);
    return this.orderRepository.updateOrder(orderId, orderItems, totalPrice);
  }

  public async deleteOrder(orderId: number): Promise<void> {
    const findOrder = await this.orderRepository.findById(orderId);
    if (!findOrder) throw new HttpException(404, "Order doesn't exist");

    this.orderRepository.deleteOrder(orderId);
  }

  private async validateProducts(orderData: CreateOrderDto | UpdateOrderDto): Promise<{ orderItems: OrderItem[]; totalPrice: number }> {
    // Check products length
    if (orderData.products.length === 0) throw new HttpException(400, 'products must be longer than or equal to 1 item');

    // Validate all product ID and qty values
    const productIds = orderData.products.map(p => {
      if (p.product_id < 1) throw new HttpException(400, 'Invalid product ID value is less than 1');
      if (p.qty < 1) throw new HttpException(400, 'Invalid qty value is less than 1');
      return p.product_id;
    });

    // Validate all product IDs exist in the database
    const validProducts = await this.productRepository.findAllInId(productIds);
    if (validProducts.length !== productIds.length) {
      throw new HttpException(400, 'Some product IDs are invalid');
    }

    // Calculate total price
    let totalPrice = 0;
    const orderItems = orderData.products.map(p => {
      const product = validProducts.find(prod => prod.id === p.product_id);
      const totalProductPrice = product.price * p.qty;
      totalPrice += totalProductPrice;

      return {
        product_id: p.product_id,
        qty: p.qty,
        total_price: totalProductPrice,
      } as OrderItem;
    });

    return { orderItems, totalPrice };
  }
}
