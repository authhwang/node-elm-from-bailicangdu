const v1 = require('./v1.js');
const v2 = require('./v2.js');
const v3 = require('./v3.js');
const v4 = require('./v4.js');
const ugc = require('./ugc.js');
const bos = require('./bos.js');
const shopping = require('./shopping.js');
const promotion = require('./promotion.js');

module.exports = function(app) {
    
    app.use('/v1',v1);
    app.use('/v2',v2);
    app.use('/v3',v3);
    app.use('/v4',v4);
    app.use('/ugc',ugc);
    app.use('/bos',bos);
    app.use('/shopping',shopping);
    app.use('/promotion',promotion);
    
}