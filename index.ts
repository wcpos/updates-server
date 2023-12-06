import { Elysia, t } from 'elysia';
import { electronRoutes } from './routes/electronRoutes';
import { proRoutes } from './routes/proRoutes';

const app = new Elysia();

app.get('/', () => {
  return 'Welcome to the WooCommerce POS Updates Server!';
});

electronRoutes(app);
proRoutes(app);

app.listen(8080);
