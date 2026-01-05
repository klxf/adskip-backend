import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export const initDb = async () => {
    if (db) return db;

    db = await open({
        filename: './ad_cache.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS ad_cache (
            bvid TEXT PRIMARY KEY,
            uid TEXT,
            has_ads INTEGER,
            ad_timestamps TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
}

export const getAdCache = async (bvid: string) => {
    const database = await initDb();
    const result = await database.get('SELECT * FROM ad_cache WHERE bvid = ?', bvid);

    if (result) {
        return {
            videoId: result.bvid,
            has_ads: result.has_ads,
            adTimestamps: JSON.parse(result.ad_timestamps)
        };
    }

    return null;
}

export const saveAdCache = async (bvid: string, uid: string, hasAds: boolean, adTimestamps: any[]) => {
    const database = await initDb();
    await database.run(
        `INSERT OR REPLACE INTO ad_cache (bvid, uid, has_ads, ad_timestamps) VALUES (?, ?, ?, ?)`,
        bvid,
        uid,
        hasAds ? 1 : 0,
        JSON.stringify(adTimestamps)
    );
}
