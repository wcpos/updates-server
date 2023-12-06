import { Database } from 'bun:sqlite';
import { join } from 'path';

// Open a database connection
const db = Database.open(join(import.meta.dir, 'cache', 'cache.sqlite'), { create: true });

// Read SQL from cacheSchema.sql
const file = Bun.file(join(import.meta.dir, 'cache', 'schemas.sql'));
const sql = await file.text();

// Execute the SQL statement to create the table
db.exec(sql);
console.log('Table `github_versions_cache` created or already exists.');

// Close the database connection
db.close();
