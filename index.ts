import {Elysia, t} from 'elysia';
import {electronRoutes} from './routes/electron-routes';
import {proRoutes} from './routes/pro-routes';
import {loggerPlugin} from './services/logging-service';

const models = {
	'success-response': t.Object({
		status: t.Number(),
		data: t.Object({}),
		message: t.Optional(t.String()),
	}),
	'error-response': t.Object({
		status: t.Number(),
		error: t.String(),
		message: t.Optional(t.String()),
		code: t.Optional(t.String()),
		details: t.Optional(t.Object({})),
	}),
};

const app = new Elysia().use(loggerPlugin).model(models);

app.get('/', () => 'Welcome to the WooCommerce POS Updates Server!');

electronRoutes(app);
proRoutes(app);

app.listen(8080);

export type ElysiaApp = typeof app;
