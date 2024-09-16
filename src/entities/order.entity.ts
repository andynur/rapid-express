import { Exclude, Expose } from 'class-transformer';

export class OrderEntity {
  @Expose()
  id: number;

  @Expose()
  customer_name?: string;

  @Exclude()
  customer_id: number;

  @Exclude()
  customer?: {
    name: string;
  };

  @Exclude()
  items?: [];

  @Expose()
  total_product?: number;

  @Expose()
  total_price: number;

  @Expose()
  order_date: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

export class OrderDetailEntity {
  @Expose()
  id: number;

  @Expose()
  customer: {
    name: string;
  };

  @Expose()
  total_product: number;

  @Expose()
  total_price: number;

  @Expose()
  order_date: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
