import {Elysia} from 'elysia';
import {databaseManager} from '../db/logs/manager';

/**
 * Map of routes to event types
 * /pro/update/:version => update-check
 * /pro/license/status => license-check
 * /pro/license/activate => license-check
 * /pro/license/deactivate => license-check
 * /pro/plugin => pro-plugin-download
 * /electron => update-check
 */
const eventTypeMap = {
	'/pro/update': 'update-check',
	'/pro/license/status': 'license-check',
	'/pro/license/activate': 'license-activate',
	'/pro/license/deactivate': 'license-deactivate',
	'/pro/plugin': 'pro-plugin-download',
	'/electron': 'update-check',
};

// Events types are values of eventTypeMap
type Events = keyof typeof eventTypeMap;

type EventData = {
	eventType: Events;
	ipAddress: string;
	source: 'plugin' | 'electron';
	userAgent: 'string';
	timestamp: Date;
	route: string;
	pluginVersion: string;
	licenseStatus: 'active' | 'expired';
	licenseKey: string;
	instance: string;
	responseTime: string;
	responseStatus: number;
	errorType: string;
	errorMessage: string;
};

/**
 *
 * @param ctx
 * @returns
 */
function createEventData(ctx): EventData {
	const startTime = ctx.store?.startTime || performance.now(); // Ensure startTime is set
	const endTime = performance.now();
	const responseTime = endTime - startTime;

	// Determine the eventType based on ctx.path starts with
	// return the value of the eventTypeMap
	const eventType = eventTypeMap[Object.keys(eventTypeMap).find(key => ctx.path.startsWith(key))];

	// How to set the source?
	const source = ctx.path.startsWith('/pro') ? 'plugin' : 'electron';

	return {
		eventType, // You'll need to determine how to set this based on the context
		ipAddress: ctx.request.headers.get('X-Forwarded-For') || ctx.request.remoteAddress,
		source, // Set this based on your logic
		userAgent: ctx.request.headers['user-agent'],
		timestamp: ctx.store.timestamp,
		route: ctx.path,
		version: ctx.params?.version,
		licenseKey: ctx.query?.key,
		instance: ctx.query?.instance,
		responseTime,
		responseStatus: ctx.store.responseStatus || ctx?.error?.status,
		errorType: ctx.store.errorType || ctx?.error?.message,
		errorMessage: ctx.store.errorMessage,
	};
}

/**
 * Elysia plugin to log events to sqlite
 */
export const loggerPlugin = () => new Elysia({
	name: 'event-logger',
})
	.onRequest(ctx => {
		ctx.store = {
			...ctx.store,
			startTime: performance.now(),
			timestamp: new Date().toISOString(),
		};
	})
	.onAfterHandle(ctx => {
		const responseStatus = ctx?.response?.status;
		const errorType = ctx?.response?.error;
		const errorMessage = ctx?.response?.message;

		ctx.store = {
			...ctx.store,
			responseStatus,
			errorType,
			errorMessage,
		};
	})
	.onResponse(ctx => {
		const eventData = createEventData(ctx);
		databaseManager.logEvent(eventData);
	})
	.onError(ctx => {
		const eventData = createEventData(ctx);
		databaseManager.logEvent(eventData);
	})
	.onStop(() => {
		databaseManager.close();
	});
