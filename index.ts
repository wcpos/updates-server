export default {
	port: 8080,
	fetch(request: Request) {
		return new Response('WooCommerce POS Updates Server');
	},
};
