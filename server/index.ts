import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {liveReload} from 'bun-livereload';

export default {
	port: 3000,
	fetch: liveReload(async (request: Request) => {
		if (request.method === 'OPTIONS') {
			return new Response('', {
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
				},
			});
		}

		const {appRouter} = await import('./router');
		const response = await fetchRequestHandler({
			router: appRouter,
			endpoint: '',
			req: request,
			async createContext() {},
		});

		response.headers.set('Access-Control-Allow-Origin', '*');

		return response;
	}),
};