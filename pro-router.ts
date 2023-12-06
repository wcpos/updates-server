import {z} from 'zod';
import {initTRPC} from '@trpc/server';
import {Octokit, type RestEndpointMethodTypes} from '@octokit/rest';

const octokit = new Octokit({
	auth: process.env.GITHUB_PAT,
});

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

export const proRouter = t.router({
	getLatest: t.procedure
		.input(z.object({version: z.string()}))
		.query(async options => {
			const {version} = options.input;

			 // Fetch latest release from GitHub
			const {data: release} = await octokit.repos.getLatestRelease({
				owner: 'wcpos',
				repo: 'woocommerce-pos-pro',
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
					assets: getAssetsForPlatform(release.assets),
					releaseDate: release.published_at,
					notes: release.body,
				},
			};
		}),
});

export type AppRouter = typeof proRouter;

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
function getAssetsForPlatform(assets: GithubAsset[]): Asset {
  console.log(assets);
  return {};
}

