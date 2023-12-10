import {Elysia, t} from 'elysia';
import {electronController} from '../controllers/electron-controller';
import type {ElysiaApp} from '../types';

export const electronRoutes = (app: ElysiaApp) => {
	app.get('/electron/:platform/:version',
		async ({params}) => electronController.getLatest(params.platform, params.version, ''),
		{
			params: t.Object({
				platform: t.String(),
				version: t.String(),
				// Channel: t.Union([t.String(), t.Undefined()]),
			}),
		},
	);
};
