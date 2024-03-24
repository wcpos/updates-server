import {Elysia, t} from 'elysia';
import {Stream} from '@elysiajs/stream';
import {electronController} from '../controllers/electron-controller';

const handleDownload = async ({params, set}) => {
	// If 'latest' or no version is provided, you might want to dynamically determine the latest version
	const version = params.version || 'latest';
	const downloadUrl = await electronController.getDownloadUrl(params.platform, version, '');

	if (typeof downloadUrl === 'string') {
		// Extract the filename from the downloadUrl
		const filename = downloadUrl.split('/').pop();
		set.headers['Content-Disposition'] = `attachment; filename="${filename}"`;

		return new Stream(
			fetch(downloadUrl, {
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
					Accept: 'application/octet-stream',
				},
			}),
		);
	}

	set.status = downloadUrl?.status;
	return downloadUrl;
};

export const electronRoutes = new Elysia({prefix: '/electron'})
	// Route with version
	.get('/download/:platform/:version',
		handleDownload,
		{
			params: t.Object({
				platform: t.String(),
				version: t.String(),
			// Channel: t.Union([t.String(), t.Undefined()]),
			}),
		},
	)
	// Route without version, treating version as optional
	.get('/download/:platform', handleDownload, {
		params: t.Object({
			platform: t.String(),
			// Version is omitted here, making it optional in practice
		}),
	})
	.get('/:platform/:version',
		async ({params}) => electronController.getLatest(params.platform, params.version, ''),
		{
			params: t.Object({
				platform: t.String(),
				version: t.String(),
			// Channel: t.Union([t.String(), t.Undefined()]),
			}),
		},
	);

