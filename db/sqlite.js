const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dbDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const file = path.join(dbDir, "lab6.sqlite");
const db = new sqlite3.Database(file);

module.exports = {
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
};
