const mongoose = require('mongoose');
const remarkData = require('../../initDatas/remark.js');

const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    remarks: [],
});

const remark = mongoose.model('remark',remarkSchema);

remark.findOne(function(err,data){
    if(!data){
        remark.create(remarkData);
    }
});

module.exports = remark;