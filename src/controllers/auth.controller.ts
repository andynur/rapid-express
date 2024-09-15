import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { apiResponseBadRequest, apiResponseCreated, apiResponseOk } from '@utils/apiResponse';
import { SignupDto } from '@dtos/signup.dto';
import { LoginDto } from '@dtos/login.dto';
import { AuthService } from '@services/auth.service';

export class AuthController {
  private authService = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signupData = req.body as SignupDto;
      if (signupData.password !== signupData.password_confirmation) {
        apiResponseBadRequest(res, 'Password Mismatch');
      }

      const { cookie, data } = await this.authService.signup(signupData);
      res.setHeader('Set-Cookie', [cookie]);
      apiResponseCreated(res, 'User signed up successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as LoginDto;
      const { cookie, data } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      apiResponseOk(res, 'Login successful', data);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.user;
      await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      apiResponseOk(res, 'Logout successful', null);
    } catch (error) {
      next(error);
    }
  };
}
