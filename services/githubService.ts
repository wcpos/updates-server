import {Octokit, type RestEndpointMethodTypes} from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

/**
 * 
 */
export async function getLatestRelease(repo: string) {
  const {data: release} = await octokit.repos.getLatestRelease({
    owner: 'wcpos',
    repo,
  });

  return release;
}

/**
 * Filter assets by platform
 */
type Asset = {
	name: string;
	contentType: string;
	size: number;
	url: string;
};
type GithubAsset = RestEndpointMethodTypes['repos']['getLatestRelease']['response']['data']['assets'][0];

export function getAssetsForPlatform(assets: GithubAsset[], platformArch: string): Asset[] {
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
