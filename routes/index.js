const v1 = require('./v1.js');

module.exports = function(app) {
    
    app.use('/v1',v1);

}