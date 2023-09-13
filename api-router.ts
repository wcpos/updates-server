import {z} from 'zod';
import {initTRPC} from '@trpc/server';

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
				url: `https://mycompany.example.com/myapp/releases/${version}`,
				name: 'My Release Name',
				notes: 'These are some release notes innit',
				pub_date: '2013-09-18T12:29:53+01:00',
			};
		}),
});

export type AppRouter = typeof router;

