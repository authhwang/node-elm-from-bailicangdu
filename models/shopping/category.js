const mongoose = require('mongoose');
const categoryData = require('../../initDatas/category.js');

const categorySchema = new mongoose.Schema({
    count : Number,
    id : Number,
    ids : [],
    image_url : String,
    level : Number,
    name : String,
    sub_categories : [
        {
            count : Number,
            id : Number,
            image_url : String,
            level : Number,
            name : String
        },
    ]
});
const category = mongoose.model('Category',categorySchema);

category.findOne(function(err,data){
    if(!data){
        categoryData.forEach(function(item){
            category.create(item);
        });
    }
})

module.exports = category;