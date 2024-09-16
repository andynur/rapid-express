import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsArray, IsString, IsDateString, IsOptional, IsEnum, ValidateNested } from 'class-validator';

export enum OrderSortEnum {
  ID = 'id',
  TOTAL_PRICE = 'total_price',
  ORDER_DATE = 'order_date',
}

export class OrderProductDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  public product_id: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  public qty: number;
}

export class CreateOrderDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  public customer_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  public products: OrderProductDto[];
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsArray()
  public products: OrderProductDto[];
}

export class OrderListQueryDto {
  @IsOptional()
  @IsString()
  customer?: string; // Customer name for filtering

  @IsOptional()
  @IsDateString()
  start_date?: string; // Date range start

  @IsOptional()
  @IsDateString()
  end_date?: string; // Date range end

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit = 10;

  @IsOptional()
  @IsEnum(OrderSortEnum)
  sort_by?: OrderSortEnum; // Sort by selected field

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort_order?: 'asc' | 'desc'; // Sort order (asc or desc)
}
