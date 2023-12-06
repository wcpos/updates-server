import {electronRouter} from './electron-router';
import {proRouter} from './pro-router';

// Import {createTRPCProxyClient, httpBatchLink, loggerLink} from '@trpc/client';
// import type {AppRouter} from './server/router';

// Const trpc = createTRPCProxyClient<AppRouter>({
// 	links: [
// 		loggerLink(),
// 		httpBatchLink({
// 			url: 'http://0.0.0.0:3000',
// 		}),
// 	],
// });

Bun.serve({
	port: 8080,
	async fetch(request: Request) {
		const url = new URL(request.url);
		const {pathname} = url;
		const parts = pathname.split(/[/?]/).filter(Boolean);

		if (parts[0] === 'electron') {
			if (parts.length >= 3) {
				const [_, platform, version, channel = ''] = parts;
				const caller = electronRouter.createCaller({});
				const result = await caller.getLatest({platform, version, channel});
				console.log(result);
				return new Response(JSON.stringify(result.data), {status: result.status, headers: {'Content-Type': 'application/json'}});
			}

			return new Response(JSON.stringify({
				error: 'No version specified',
			}), {status: 400, headers: {'Content-Type': 'application/json'}});
		}

		if (parts[0] === 'pro') {
			if (parts.length >= 2) {
				const [_, version] = parts;
				const caller = proRouter.createCaller({});
				const result = await caller.getLatest({version});
				console.log(result);
				return new Response(JSON.stringify(result.data), {status: result.status, headers: {'Content-Type': 'application/json'}});
			}

			return new Response(JSON.stringify({
				error: 'No version specified',
			}), {status: 400, headers: {'Content-Type': 'application/json'}});
		}

		return new Response('WooCommerce POS Updates Server!');
	},
});
