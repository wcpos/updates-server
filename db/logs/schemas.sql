CREATE TABLE IF NOT EXISTS event_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventType TEXT,
    ipAddress TEXT,
    source TEXT,
    userAgent TEXT,
    timestamp TEXT,
    route TEXT,
    pluginVersion TEXT,
    licenseStatus TEXT,
    licenseKey TEXT,
    instance TEXT,
    responseTime REAL,
    responseStatus INTEGER,
    errorType TEXT,
    errorMessage TEXT
);
