import {getLatestRelease, getAssetsForPlatform} from '../services/github-service';

export const electronController = {
	async getLatest(platform: string, version: string, channel: string) {
		const release = await getLatestRelease('electron');

		if (!release) {
			return {status: 404, data: {error: 'No release found'}};
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
