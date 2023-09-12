import {z} from 'zod';
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import {db} from './db';
import {publicProcedure, router} from './trpc';

export const appRouter = router({
	userList: publicProcedure
		.query(async () => {
			// Retrieve users from a datasource, this is an imaginary database
			const users = await db.user.findMany();

			return users;
		}),

	userById: publicProcedure
		.input(z.string())
		.query(async options => {
			const {input} = options;

			// Retrieve the user with the given ID
			const user = await db.user.findById(input);

			return user;
		}),

	userCreate: publicProcedure
		.input(z.object({
			name: z.string(),
		}))
		.mutation(async options => {
			const {input} = options;
			// Create a user in a datasource, this is an imaginary database
			const user = await db.user.create(
				input,
			);
			return user;
		}),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
