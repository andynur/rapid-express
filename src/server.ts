import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';
import { ValidateEnv } from '@utils/validateEnv';
import { IndexRoute } from './routes/index.route';

ValidateEnv();

const app = new App([new IndexRoute(), new UserRoute(), new AuthRoute()]);

app.listen();
