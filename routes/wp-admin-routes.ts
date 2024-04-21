import {Elysia, t} from 'elysia';
import {renderToReadableStream} from 'react-dom/server'; // This caused an error?
import {Stream} from '@elysiajs/stream';
import {HelloWorld} from '../components/hello-world.tsx';

export const wpAdminRoutes = new Elysia({prefix: '/wp-admin'})
	.get('/landing',
		async ({params, query, set}) => {
			// Set CORS headers
			set.headers['Access-Control-Allow-Origin'] = '*';
			set.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
			set.headers['Access-Control-Allow-Headers'] = 'Content-Type';
			set.headers['Access-Control-Allow-Credentials'] = 'true';

			const stream = await renderToReadableStream(
				HelloWorld,
			);

			return new Stream(
				stream,
				// {
				//     status: 200,
				//     headers: {
				//         'Content-Type': 'text/html',
				//     },
				// },
			);
		},
		{
			// Params: t.Object({
			//     version: t.String(),
			// }),
			// query: t.Object({
			//     key: t.String(),
			//     instance: t.String(),
			// }),
			// Response: responseModels,
		},
	);

