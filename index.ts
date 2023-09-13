import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import {serve} from 'bun';
import type {AppRouter} from './server/router';

const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'http://localhost:3000',
		}),
	],
});

serve({
	port: 8080,
	async fetch(request: Request) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const parts = pathname.split(/[/?]/).filter(Boolean);

		if (parts[0] === 'electron') {
			if (parts.length >= 3) {
				const [_, platform, version, channel = ''] = parts;
				const result = await trpc.getUpdate.query({platform, version, channel});
				return new Response(JSON.stringify(result), {status: 200, headers: {'Content-Type': 'application/json'}});
			}

			return new Response(JSON.stringify({
				error: 'No version specified',
			}), {status: 400, headers: {'Content-Type': 'application/json'}});
		}

		return new Response('WooCommerce POS Updates Server!');
	},
});
