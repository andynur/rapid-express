import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { IndexRoute } from '@routes/index.route';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';
import { CustomerRoute } from '@routes/customer.route';
import { ProductRoute } from '@routes/product.route';
import { OrderRoute } from '@routes/order.route';

ValidateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute(), new CustomerRoute(), new ProductRoute(), new OrderRoute()]);

app.listen();
