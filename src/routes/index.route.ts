import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { HomeController } from '@controllers/home.controller';

export class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public home = new HomeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.home.index);
  }
}
