const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);

mongoose.connect(config.url);//无需加auto_reconnect:true 因为默认就是true
mongoose.Promise = global.Promise; //暂时没看出这个是要干啥

const db = mongoose.connection;
db.once('open',() => {
    console.log('连接数据库成功');
});

db.on('error',(error) => {
    console.log('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close',() => {
    console.log('数据库断开,重新连接数据库');
    mongoose.connect(config.url);
});

module.exports = db;