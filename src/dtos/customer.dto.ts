import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}
