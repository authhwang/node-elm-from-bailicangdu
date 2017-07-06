const mongoose = require('mongoose');

const statisSchema = mongoose.Schema({
    date: String,
    origin : String,
    id : Number,
});

statisSchema.index({id : 1});
const statis = mongoose.model('Statis',statisSchema);

module.exports = statis;