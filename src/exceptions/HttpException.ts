import { ApiResponse } from '@/interfaces/api-response.interface';

export class HttpException extends Error implements ApiResponse {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
