import {getLatestRelease, fetchZipByTag} from '../services/github-service';
import {fetchLicenseStatus} from '../services/license-service';

async function getUpdateDetails(version: string) {
	// Call service to get latest release
	const release = await getLatestRelease('woocommerce-pos-pro');
	if (!release) {
		return {status: 404, error: 'No release found'};
	}

	// Process and return data
	return {
		status: 200,
		data: {
			version: release.tag_name.replace(/v/, ''),
			name: release.name,
			release_date: release.published_at,
			notes: release.body,
			download_url: `https://updates.wcpos.com/pro/download/${release.tag_name.replace(/v/, '')}`,
		},
	};
}

async function activateLicense(licenseKey: string, instance: string) {
	// Logic to activate a license
	// Return the response format expected by your tRPC procedure
}

async function deactivateLicense(licenseKey: string, instance: string) {
	// Logic to deactivate a license
	// Return the response format expected by your tRPC procedure
}

async function getLicenseStatus(licenseKey: string, instance: string) {
	const response = await fetchLicenseStatus(licenseKey, instance);

	// If not 200, return error
	if (!response.ok) {
		return {status: 404, error: 'Error contacting license server.'};
	}

	// Try to parse response
	try {
		const body = await response.json();

		/**
		 * The WooCommerec AM plugin returns random codes
		 * - if there is an error it might have code: '100'
		 * - if it is a success, there is no code, but success = true
		 *
		 * NOTE!! The 'status_check' is not the subscription status, it's whether the key and instance are active
		 * I need to change this when I change license server
		 *
		 * TODO: move away from this shitty plugin asap
		 */
		if (body.success) {
			return {
				status: 200,
				data: {
					status: body.status_check,
					...body.data,
				},
			};
		}

		/**
		 * Code = 100 plus 'A customer account does not exist for this API Key.'
		 */
		if (body.code === '100' && body.error === 'A customer account does not exist for this API Key.') {
			return {
				status: 404,
				error: 'Not Found',
				message: 'A customer account does not exist for this API Key.',
			};
		}

		/**
		 * Code = 100 means there are no API slots available,
		 * could be expired or perhaps the user has too many instances?
		 */
		if (body.code === '100') {
			return {
				status: 403,
				error: 'License Expired',
				message: 'Your license has expired. Please renew your license to continue receiving updates.',
			};
		}

		if (body.code !== '200') {
			return {
				status: 400,
				error: 'Bad Request',
				message: body.error,
			};
		}

		throw new Error(JSON.stringify(body));
	} catch (error) {
		return {
			status: 400,
			error: 'Error',
			message: error.message,
		};
	}
}

async function downloadProPlugin(version: string, licenseKey: string, instance: string) {
	try {
		const response = await getLicenseStatus(licenseKey, instance);

		if (response.status === 200 && !response.data.activated) {
			return {
				status: 403,
				error: 'License not activated',
				message: 'Your license is not activated. Please activate your license to download the plugin.',
			};
		}

		if (response.status !== 200) {
			return response;
		}

		return await fetchZipByTag('woocommerce-pos-pro', version);
	} catch (error) {
		return {
			status: 400,
			error: 'Error',
			message: error.message,
		};
	}
}

export const proController = {
	getUpdateDetails,
	activateLicense,
	deactivateLicense,
	getLicenseStatus,
	downloadProPlugin,
};
