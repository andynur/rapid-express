import { PrismaClient, Order, OrderItem } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';

@Service()
export class OrderRepository {
  private prisma = new PrismaClient();

  public async findAll(
    customer?: string,
    start_date?: string,
    end_date?: string,
    page = 1,
    limit = 10,
    sort_by = 'id',
    sort_order: 'asc' | 'desc' = 'desc',
  ): Promise<{ orders: Order[]; totalItems: number }> {
    const whereClause: any = {};

    if (customer) {
      whereClause.customer = { name: { contains: customer } };
    }

    if (start_date || end_date) {
      whereClause.order_date = {};
      if (start_date) whereClause.order_date.gte = new Date(`${start_date} 00:00:01`);
      if (end_date) whereClause.order_date.lte = new Date(`${end_date} 23:59:59`);
    }

    // Get total items for pagination
    const totalItems = await this.prisma.order.count({ where: whereClause });

    // Get paginated orders
    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        [sort_by]: sort_order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { orders, totalItems };
  }

  public async findById(orderId: number): Promise<{ id: number }> {
    return this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
      },
    });
  }

  public async findDetailById(orderId: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true, // Eager loading customer
        items: {
          include: {
            product: true, // Eager loading product details in order items
          },
        },
      },
    });
  }

  public async createOrder(orderItems: OrderItem[], totalPrice: number, customerId: number): Promise<Order> {
    try {
      // Start a transaction to create the order and order items
      const result = await this.prisma.$transaction(async tx => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            customer_id: customerId,
            total_price: totalPrice,
          },
        });

        // Create the order items associated with the order
        await tx.orderItem.createMany({
          data: orderItems.map(item => ({ ...item, order_id: newOrder.id })),
        });

        return newOrder;
      });

      return result;
    } catch (error) {
      throw new HttpException(500, 'Failed to create order: ' + error.message);
    }
  }

  public async updateOrder(orderId: number, orderItems: OrderItem[], totalPrice: number): Promise<Order> {
    try {
      // Start a transaction to update the order and order items
      const result = await this.prisma.$transaction(async tx => {
        // Update the order with the new total price
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            total_price: totalPrice,
          },
        });

        // Delete existing order items for this order
        await tx.orderItem.deleteMany({
          where: { order_id: orderId },
        });

        // Create the new order items
        await tx.orderItem.createMany({
          data: orderItems.map(item => ({ ...item, order_id: updatedOrder.id })),
        });

        return updatedOrder;
      });

      return result;
    } catch (error) {
      throw new HttpException(500, 'Failed to update order: ' + error.message);
    }
  }

  public async deleteOrder(orderId: number): Promise<void> {
    try {
      // Start a transaction to create the order and order items
      return await this.prisma.$transaction(async tx => {
        // Delete all order items
        await tx.orderItem.deleteMany({
          where: {
            order_id: orderId,
          },
        });

        // Create the order
        await tx.order.delete({
          where: {
            id: orderId,
          },
        });
      });
    } catch (error) {
      throw new HttpException(500, 'Failed to delete order: ' + error.message);
    }
  }
}
