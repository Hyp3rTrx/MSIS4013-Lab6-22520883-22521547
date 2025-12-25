require("dotenv").config();
const mysql2 = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function createMysqlPool() {
  const pool = mysql2.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lab6_auth",
    waitForConnections: true,
    connectionLimit: 10,
  });
  await pool.query("SELECT 1");
  pool.isSqlite = false;
  return pool;
}

function createSqliteFallback() {
  const sqlite3 = require("sqlite3").verbose();
  const dbDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const file = path.join(dbDir, "sqlite.db");
  const db = new sqlite3.Database(file);
  const api = {
    isSqlite: true,
    async execute(sql, params = []) {
      sql = sql.trim();
      return new Promise((resolve, reject) => {
        const first = sql.split(" ")[0].toUpperCase();
        if (first === "SELECT") {
          db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve([rows]);
          });
        } else {
          db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve([{ affectedRows: this.changes, lastID: this.lastID }]);
          });
        }
      });
    },
    close() {
      db.close();
    },
  };
  return api;
}

let dbInstance = null;
let ready = (async () => {
  try {
    dbInstance = await createMysqlPool();
    console.log("Connected to MySQL");
  } catch (err) {
    console.warn(
      "MySQL connection failed, using SQLite fallback:",
      err.message
    );
    dbInstance = createSqliteFallback();
  }
})();

module.exports = {
  ready,
  async execute(sql, params = []) {
    await ready;
    return dbInstance.execute(sql, params);
  },
  get isSqlite() {
    return dbInstance && dbInstance.isSqlite;
  },
  close() {
    if (dbInstance && dbInstance.close) return dbInstance.close();
    return Promise.resolve();
  },
};
