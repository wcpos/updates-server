import {Elysia, t} from 'elysia';
import {Stream} from '@elysiajs/stream';
import {electronController} from '../controllers/electron-controller';

const handleDownload = async ({params, set}) => {
	// If 'latest' or no version is provided, you might want to dynamically determine the latest version
	const version = params.version || 'latest';
	const downloadInfo = await electronController.getDownloadUrl(params.platform, version, '');

	if (downloadInfo.url && downloadInfo.size > 0) {
		set.headers['Content-Disposition'] = `attachment; filename="${downloadInfo.name}"`;
		set.headers['Content-Length'] = downloadInfo.size.toString();
		set.headers['Content-Type'] = downloadInfo.contentType || 'application/octet-stream';

		return new Stream(
			fetch(downloadInfo.url, {
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
					Accept: 'application/octet-stream',
				},
			}).then(response => response.body), // Ensure that you're returning the readable stream from the fetch response
		);
	}

	// Handle the case where downloadInfo does not contain a valid URL (e.g., an error object)
	if (downloadInfo.status) {
		set.status = downloadInfo.status;
		return downloadInfo;
	}

	// Default error handling if the response structure is unexpected
	set.status = 500;
	return 'Internal Server Error';
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

