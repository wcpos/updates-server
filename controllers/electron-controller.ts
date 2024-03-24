import semver from 'semver';
import {getLatestRelease, getAssetsForPlatform} from '../services/github-service';

/**
 *
 * @param platform
 * @param version
 * @param channel
 * @returns
 */
async function getLatest(platform: string, version: string, channel: string) {
	const release = await getLatestRelease('electron');

	if (!release) {
		return {status: 404, error: 'No release found'};
	}

	/**
	 * Backwards compatibility for electron versions < 1.4.0
	 * It expects the response to be in the format:
	 * {
	 *  version: '1.3.0',
	 *  ...
	 * }
	 */
	if (semver.lt(version, '1.4.0')) {
		return {
			version: release.tag_name.replace(/v/, ''),
			name: release.name,
			assets: getAssetsForPlatform(release.assets, platform),
			releaseDate: release.published_at,
			notes: release.body,
		};
	}

	return {
		status: 200,
		data: {
			version: release.tag_name.replace(/v/, ''),
			name: release.name,
			assets: getAssetsForPlatform(release.assets, platform),
			releaseDate: release.published_at,
			notes: release.body,
		},
	};
}

/**
 * Just getting latest at the moment, but could be adjust to get specific version
 *
 * @param platform
 * @param version
 * @param channel
 */
async function getDownloadUrl(platform: string, version: string, channel: string) {
	const release = await getLatestRelease('electron');

	// Define a mapping of platforms to their corresponding file extensions and partial identifiers
	const platformMapping = {
		'darwin-arm64': {extension: 'dmg', identifier: 'arm64'},
		'darwin-x64': {extension: 'dmg', identifier: 'x64'},
		'win32-x64': {extension: 'exe', identifier: 'Setup'}, // This is a hack, I need to label the assets properly
	};

	const {extension, identifier} = platformMapping[platform];

	// Filter for assets matching the specified platform by extension and, if applicable, identifier
	const filteredAssets = release.assets.filter(asset => {
		const matchesExtension = asset.name.endsWith(`.${extension}`);
		// If an identifier is specified for the platform, check for its presence
		const matchesIdentifier = identifier ? asset.name.includes(identifier) : true;
		return matchesExtension && matchesIdentifier;
	});

	// Assuming we're interested in the first match
	if (filteredAssets.length > 0) {
		const asset = filteredAssets[0];
		return {
			name: asset.name,
			url: asset.browser_download_url,
			size: asset.size,
			contentType: asset.content_type,
		};
	}

	return {
		status: 404,
		error: 'No download found',
	};
}

export const electronController = {
	getLatest,
	getDownloadUrl,
};
