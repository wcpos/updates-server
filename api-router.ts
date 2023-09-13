import {z} from 'zod';
import {initTRPC} from '@trpc/server';
import {Octokit} from '@octokit/rest';

const octokit = new Octokit({
	auth: 'mypersonalaccesstoken123',
});

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

export const router = t.router({
	getLatest: t.procedure
		.input(z.object({platform: z.string(), version: z.string(), channel: z.string()}))
		.query(async options => {
			const {platform, version, channel} = options.input;
			console.log('hi');
			// Fetch or construct the necessary data here
			return {
				version: '1.3.3',
				files: [
					{
						url: 'https://github.com/wcpos/electron/releases/download/v1.3.3/WooCommerce-POS-darwin-x64-1.3.3.zip',
						sha512: '5dbb6254ffa6ce82400f59d37977719e924de56bd0ad7924506371e9efca4b651093a9825eb24a51833c43b8ba5f051c7e17107b63445c9c0bb2ec3419a5c4a5',
					},
				],
				path: 'WooCommerce-POS-darwin-x64-1.3.3.zip',
				sha512: '5dbb6254ffa6ce82400f59d37977719e924de56bd0ad7924506371e9efca4b651093a9825eb24a51833c43b8ba5f051c7e17107b63445c9c0bb2ec3419a5c4a5',
				releaseDate: '2023-09-13T00:00:00.000Z',
				releaseNotes: 'Bug fixes and performance improvements.',
			};
		}),
});

export type AppRouter = typeof router;

