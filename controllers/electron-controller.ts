import semver from 'semver';
import {getLatestRelease, getAssetsForPlatform} from '../services/github-service';

export const electronController = {
	async getLatest(platform: string, version: string, channel: string) {
		const release = await getLatestRelease('electron');

		if (!release) {
			return {status: 404, data: {error: 'No release found'}};
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
	},
};
