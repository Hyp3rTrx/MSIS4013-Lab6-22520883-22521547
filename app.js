require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const db = require('./db/mysql');
const mongo = require('./db/mongo');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const messageRoutes = require('./routes/message.routes');

app.use(express.json());
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', messageRoutes);

async function startServer(){
  // connect mongo then start server (mirror lab6-main)
  mongo.connect().then(()=>{
    app.listen(port, ()=> console.log(`App listening on ${port}`));
  }).catch(err=>{
    console.error('Mongo connection failed:', err);
    app.listen(port, ()=> console.log(`App listening on ${port} (Mongo connection failed)`));
  });
}

if (process.argv.includes('--setup')){
  (async ()=>{
    try {
      await require('./routes/auth.routes').setupDb();
      console.log('Setup done');
      process.exit(0);
    } catch (err){
      console.error('Setup failed', err);
      process.exit(1);
    }
  })();
} else {
  startServer();
}

module.exports = app;
