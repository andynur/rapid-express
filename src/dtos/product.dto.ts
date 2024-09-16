import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({ maxDecimalPlaces: 2 })
  public price: number;
}
