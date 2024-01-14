import {Elysia, t} from 'elysia';
import {Stream} from '@elysiajs/stream';
import {proController} from '../controllers/pro-controller';
import type {ElysiaApp} from '../types';

const responseModels = {
	200: 'success-response',
	201: 'success-response',
	400: 'error-response',
	401: 'error-response',
	404: 'error-response',
	500: 'error-response',
	503: 'error-response',
};

export const proRoutes = (app: ElysiaApp) => {
	app.get('/pro/update/:version',
		async ({params, set}) => {
			const response = proController.getUpdateDetails(params.version);
			set.status = response.status;
			return response;
		},
		{
			params: t.Object({
				version: t.String(),
			}),
			response: responseModels,
		},
	);

	app.get('/pro/license/status',
		async ({query, set}) => {
			const response = await proController.getLicenseStatus(query.key, query.instance);
			set.status = response.status;
			return response;
		},
		{
			query: t.Object({
				key: t.String(),
				instance: t.String(),
			}),
			response: responseModels,
		},
	);

	app.post('/pro/license/activate',
		async ({body}) => proController.activateLicense(body.key, body.instance),
		{
			body: t.Object({
				key: t.String(),
				instance: t.String(),
			}),
			response: responseModels,
		},
	);

	app.post('/pro/license/deactivate',
		async ({body}) => proController.deactivateLicense(body.key, body.instance),
		{
			body: t.Object({
				key: t.String(),
				instance: t.String(),
			}),
			response: responseModels,
		},
	);

	app.get('/pro/download/:version',
		async ({params, query, set}) => {
			const downloadUrl = await proController.downloadProPlugin(params.version, query.key, query.instance);
			if (typeof downloadUrl === 'string') {
				set.headers['Content-Disposition'] = 'attachment; filename=woocommerce-pos-pro.zip';

				return new Stream(
					fetch(downloadUrl, {
						headers: {
							Authorization: `token ${process.env.GITHUB_PAT}`,
							Accept: 'application/octet-stream',
						},
					}),
				);
			}

			set.status = downloadUrl?.status;
			return downloadUrl;
		},
		{
			params: t.Object({
				version: t.String(),
			}),
			query: t.Object({
				key: t.String(),
				instance: t.String(),
			}),
			// Response: responseModels,
		},
	);
};
