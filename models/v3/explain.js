const mongoose = require('mongoose');
const explainDatas = require('../../initDatas/explain.js');
const Schema = mongoose.Schema;

const explainSchema = new Schema({
    data: Schema.Types.Mixed
})

const explain = mongoose.model('explain',explainSchema);
explain.findOne(function(err,data){
    if(!data){
        explain.create({data: explainDatas});
    }
})
module.exports = explain;