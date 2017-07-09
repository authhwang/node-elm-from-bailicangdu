const mongoose = require('mongoose');
const entryData = require('../../initDatas/entry.js');

const entrySchema = mongoose.Schema({
    id : Number,
    is_in_serving : Boolean,
    description : String,
    title : String,
    link : String,
    imageUrl : String,
    iconUrl : String,
    titleColor : String,
});

const entry = mongoose.model('Entry',entrySchema);

entry.findOne(function(err,data){
    if(!data){
        entryData.forEach(function(item){
            entry.create(item);
        })
    }
})

module.exports = entry;