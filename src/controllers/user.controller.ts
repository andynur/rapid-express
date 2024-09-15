import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/user.service';
import { apiResponseOk, apiResponseCreated } from '@utils/apiResponse';
import { CreateUserDto } from '@dtos/user.dto';
import { UserInfo } from '@/interfaces/user.interface';

export class UserController {
  private userService = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.findAllUser();
      apiResponseOk(res, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user = await this.userService.findUserById(userId);
      apiResponseOk(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserDto;
      const data = await this.userService.createUser(userData);
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
      apiResponseOk(res, 'User deleted successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
