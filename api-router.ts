import {z} from 'zod';
import {initTRPC} from '@trpc/server';
import {Octokit, type RestEndpointMethodTypes} from '@octokit/rest';

const octokit = new Octokit({
	Auth: process.env.GITHUB_PAT,
});

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

export const router = t.router({
	getLatest: t.procedure
		.input(z.object({platform: z.string(), version: z.string(), channel: z.string()}))
		.query(async options => {
			const {platform, version, channel} = options.input;

			 // Fetch latest release from GitHub
			const {data: release} = await octokit.repos.getLatestRelease({
				owner: 'wcpos',
				repo: 'electron',
			});

			// If no release found, return 404
			if (!release) {
				return {
					status: 404,
					data: {
						error: 'No release found',
					},
				};
			}

			 // Return the requested assets
			return {
				status: 200,
				data: {
				// Remove the v from the version
					version: release.tag_name.replace(/v/, ''),
					name: release.name,
					assets: getAssetsForPlatform(release.assets, platform),
					releaseDate: release.published_at,
					notes: release.body,
				},
			};
		}),
});

export type AppRouter = typeof router;

type Asset = {
	name: string;
	contentType: string;
	size: number;
	url: string;
};
type GithubAsset = RestEndpointMethodTypes['repos']['getLatestRelease']['response']['data']['assets'][0];

/**
 * Filter assets by platform
 */
function getAssetsForPlatform(assets: GithubAsset[], platformArch: string): Asset[] {
	const [platform, arch] = platformArch.split('-');

	return assets
		.filter(asset => {
			if (platform === 'win32') {
				return asset.name === 'RELEASES' || asset.name.endsWith('.nupkg');
			}

			if (platform === 'linux') {
				return asset.name.endsWith('.AppImage');
			}

			return asset.name.includes(`${platform}-${arch}`) && asset.name.endsWith('.zip');
		})
		.map(asset => ({
			name: asset.name,
			contentType: asset.content_type,
			size: asset.size,
			url: asset.browser_download_url,
		}));
}

