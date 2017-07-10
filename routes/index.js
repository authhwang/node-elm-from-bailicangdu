const v1 = require('./v1.js');
const v2 = require('./v2.js');
const shopping = require('./shopping.js');
module.exports = function(app) {
    
    app.use('/v1',v1);
    app.use('/v2',v2);
    app.use('/shopping',shopping);
}