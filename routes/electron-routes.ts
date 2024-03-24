import {Elysia, t} from 'elysia';
import {electronController} from '../controllers/electron-controller';

const handleDownload = async ({params, set}) => {
	// If 'latest' or no version is provided, you might want to dynamically determine the latest version
	const version = params.version || 'latest';
	const downloadUrl = await electronController.getDownloadUrl(params.platform, version, '');

	if (typeof downloadUrl === 'string') {
		set.redirect = downloadUrl;
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

