import { apiResponseOk } from '@/utils/apiResponse';
import { NextFunction, Request, Response } from 'express';

export class HomeController {
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      apiResponseOk(res, 'Rapid Express API v1.0', null);
    } catch (error) {
      next(error);
    }
  };
}
