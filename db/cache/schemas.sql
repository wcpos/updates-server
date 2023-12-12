CREATE TABLE IF NOT EXISTS github_versions_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_name TEXT NOT NULL,
    latest_version TEXT NOT NULL,
    release_data TEXT, -- JSON string containing additional release data like notes, download links, etc.
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
