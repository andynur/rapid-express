import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/user.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateUserDto } from '@dtos/user.dto';
import { UserInfo } from '@/interfaces/user.interface';
import redis from '@/config/redis';

export class UserController {
  private userService = Container.get(UserService);
  private cacheKey = 'users';

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = 'Users retrieved successfully';

      // Check cache first
      const cachedUsers = await redis.get(this.cacheKey);
      if (cachedUsers) {
        apiResponseOk(res, message, JSON.parse(cachedUsers));
      }

      // If no cache, query database
      const users = await this.userService.findAllUser();
      // Store the result in Redis cache with an expiry time (e.g., 1 hour = 3600 seconds)
      await redis.set(this.cacheKey, JSON.stringify(users), 'EX', 3600);

      apiResponseOk(res, message, users);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const message = 'User detail retrieved successfully';

      // Check cache first
      const cachedUserDetail = await redis.get(`${this.cacheKey}_${userId}`);
      if (cachedUserDetail) {
        apiResponseOk(res, message, JSON.parse(cachedUserDetail));
      }

      // If no cache, query database
      const user = await this.userService.findUserById(userId);
      // Store the result in Redis cache with an expiry time (e.g., 1 hour = 3600 seconds)
      await redis.set(`${this.cacheKey}_${userId}`, JSON.stringify(user), 'EX', 3600);

      apiResponseOk(res, message, user);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserDto;
      const data = await this.userService.createUser(userData);

      // clears users cache
      await redis.del(this.cacheKey);

      apiResponseCreated(res, 'User created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body as CreateUserDto;
      const data = await this.userService.updateUser(userId, userData);

      // clears all users cache
      await redis.del([this.cacheKey, `${this.cacheKey}_${userId}`]);

      apiResponseOk(res, 'User updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userInfo: UserInfo = req.user;
      const userId = Number(req.params.id);
      await this.userService.deleteUser(userInfo, userId);

      // clears all users cache
      await redis.del([this.cacheKey, `${this.cacheKey}_${userId}`]);

      apiResponseOk(res, 'User deleted successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
