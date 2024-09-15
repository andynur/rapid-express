export interface ApiResponse {
  status: number;
  message: string;
  data?: any;
  errors?: any;
  meta?: any; // Optional metadata, for example pagination info
}
