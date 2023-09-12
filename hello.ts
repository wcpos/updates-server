const app = {
	port: 8080,
	fetch(request: Request) {
		return new Response('Hello World');
	},
};

export default app;
