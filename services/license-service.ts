/**
 *
 */
export async function fetchLicenseStatus(licenseKey: string, instance: string) {
	// Contruct api URL - https://wcpos.com/?wc-api=am-software-api&wc_am_action=status
	const url = new URL('https://wcpos.com');
	const searchParameters = new URLSearchParams();
	searchParameters.append('wc-api', 'am-software-api');
	searchParameters.append('wc_am_action', 'status');
	searchParameters.append('product_id', '815');
	searchParameters.append('api_key', licenseKey);
	searchParameters.append('instance', instance);

	url.search = searchParameters.toString();
	return fetch(url);
}
