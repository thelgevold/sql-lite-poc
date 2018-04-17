
const sqlite3 = require('sqlite3').verbose();
const sqlLiteService = require('./sql-lite-service');
const BuildResult = require('./build-result');

sqlLiteService.connect().then(db => {
  return Promise.all([
    sqlLiteService.addBuildResult(db, new BuildResult(true, 60000)),
    sqlLiteService.addBuildResult(db, new BuildResult(true, 60000)),
    sqlLiteService.addBuildResult(db, new BuildResult(true, 160000)),
    sqlLiteService.addBuildResult(db, new BuildResult(true, 30000)),
    sqlLiteService.addBuildResult(db, new BuildResult(true, 50000)),

    sqlLiteService.addBuildResult(db, new BuildResult(false, 200000)),
    sqlLiteService.addBuildResult(db, new BuildResult(false, 90000)),
    sqlLiteService.addBuildResult(db, new BuildResult(false, 10000))
  ]).then(() => db)
}).then(db => {
  return Promise.all([sqlLiteService.getPassingBuilds(db), 
                      sqlLiteService.getFailingBuilds(db)]);
  db.close();
}).then(res => {
  console.log();
  console.log('PASSING BUILDS');
  console.log(res[0]);

  console.log();
  console.log('FAILING BUILDS');
  console.log(res[1]);
}); 

 
