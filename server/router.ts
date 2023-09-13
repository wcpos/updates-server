import {z} from 'zod';
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import {db} from './db';
import {publicProcedure, router} from './trpc';

export const appRouter = router({
	getUpdate: publicProcedure.input(z.object({platform: z.string(), version: z.string(), channel: z.string()})).query(async ({input}) => {
		const {platform, version, channel} = input;
		console.log('hi');
		// Fetch or construct the necessary data here
		return {
			url: `https://mycompany.example.com/myapp/releases/${version}`,
			name: 'My Release Name',
			notes: 'These are some release notes innit',
			pub_date: '2013-09-18T12:29:53+01:00',
		};
	}),
	// Handler for /update/:platform/:version[/:channel]
	// 	.query('update.$platform.$version.$channel?', {
	// 		async resolve({input}) {
	// 			const {platform, version, channel} = input;
	// 			console.log('hi');
	// 			// Fetch or construct the necessary data here
	// 			return {
	// 				url: `https://mycompany.example.com/myapp/releases/${version}`,
	// 				name: 'My Release Name',
	// 				notes: 'These are some release notes innit',
	// 				pub_date: '2013-09-18T12:29:53+01:00',
	// 			};
	// 		},
	// 	})
	// // Handler for /update/flavor/:flavor/:platform/:version[/:channel]
	// 	.query('update.flavor.$flavor.$platform.$version.$channel?', {
	// 		async resolve({input}) {
	// 			const {flavor, platform, version, channel} = input;
	// 			// Fetch or construct the necessary data here
	// 			return {
	// 				url: `https://mycompany.example.com/myapp/releases/${flavor}/${version}`,
	// 				name: 'My Release Name',
	// 				notes: 'These are some release notes innit',
	// 				pub_date: '2013-09-18T12:29:53+01:00',
	// 			};
	// 		},
	// 	})
	// // Handler for /notes/:version/:flavor?
	// 	.query('notes.$version.$flavor?', {
	// 		async resolve({input}) {
	// 			const {version, flavor} = input;
	// 			// Fetch or construct the necessary data here
	// 			return {
	// 				url: `https://mycompany.example.com/myapp/releases/${version}`,
	// 				name: 'My Release Name',
	// 				notes: 'These are some release notes innit',
	// 				pub_date: '2013-09-18T12:29:53+01:00',
	// 			};
	// 		},
	// 	}),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
