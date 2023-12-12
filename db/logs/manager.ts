import {join} from 'node:path';
import {Database} from 'bun:sqlite';

class DatabaseManager {
	private db: Database | undefined = null;

	constructor() {}

	async init() {
		this.db = Database.open(join(import.meta.dir, 'logs.sqlite'), {create: true});

		const schemas = Bun.file(join(import.meta.dir, 'schemas.sql'));
		const sql = await schemas.text();
		this.db.exec(sql);
		console.log('Database initialized with tables.');
	}

	async logEvent(eventData: EventData) {
		const statement = this.db.prepare(`INSERT INTO event_logs (
            eventType, ipAddress, source, userAgent, timestamp, route, 
            pluginVersion, licenseStatus, licenseKey, instance, responseTime, 
            responseStatus, errorType, errorMessage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

		statement.run(
			eventData.eventType,
			eventData.ipAddress,
			eventData.source,
			eventData.userAgent,
			eventData.timestamp,
			eventData.route,
			eventData.pluginVersion,
			eventData.licenseStatus,
			eventData.licenseKey,
			eventData.instance,
			eventData.responseTime,
			eventData.responseStatus,
			eventData.errorType,
			eventData.errorMessage,
		);

		statement.finalize();
	}

	close() {
		console.log('Database closing.');
		this.db?.close();
	}
}

// Usage
export const databaseManager = new DatabaseManager();

await databaseManager.init();

