const sqlite3 = require('sqlite3').verbose();

const dbName = process.argv[2];

class SqlLiteService {
  connect() {
    // Connect
    return new Promise((resolve, reject) => {
      let db = new sqlite3.Database(dbName, err => {
        if(err) {
          reject(err);
        }
        else {
          resolve(db);
        }
      });
    }).then(db => 
      // Ensure table exists
      new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS builds(buildId INTEGER PRIMARY KEY, 
                                                  duration INTEGER, 
                                                  buildPassed BIT, 
                                                  created DATE)`, err => {
          if(err) {
            reject(err);
          }
          else {
            resolve(db);
          }
        });
      })
    );
  }

  addBuildResult(db, buildResult) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO builds(duration, buildPassed, created) VALUES(?, ?, ?)`, 
              [buildResult.duration, buildResult.buildPassed, buildResult.created], err => {
        if (err) {
          reject(err.message);
        }
        else {
          resolve(db);
        }
      });
    })
  }

  select(db, sql) {
    return new Promise((resolve, reject) => {
      db.all(sql, [], (error, rows) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(rows);
        }
      });
    });
  }

  getPassingBuilds(db) {
    const sql = `SELECT buildId, duration, buildPassed, created FROM builds
                 WHERE buildPassed = 1  
                 ORDER BY created desc LIMIT 10`;

    return this.select(db, sql);
  }

  getFailingBuilds(db) {
    const sql = `SELECT buildId, duration, buildPassed, created FROM builds
                 WHERE buildPassed = 0  
                 ORDER BY created desc LIMIT 10`;

    return this.select(db, sql);
  }  
}

module.exports = new SqlLiteService();