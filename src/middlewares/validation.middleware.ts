import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Transform the request body into the DTO and apply transformation decorators like @Transform
      const dto = plainToInstance(type, req.body);

      // Validate the transformed DTO
      await validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });

      // If validation passes, replace the request body with the transformed DTO
      req.body = dto;
      next();
    } catch (errors) {
      // Collect error messages and throw a validation error
      const message = errors.map((error: ValidationError) => (error.constraints ? Object.values(error.constraints).join(', ') : error.toString()));
      next(new HttpException(400, message.join(', ')));
    }
  };
};
