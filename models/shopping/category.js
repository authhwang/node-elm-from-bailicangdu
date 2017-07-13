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

categorySchema.statics.addCategory = async function(type){
    const categoryName = type.split('/');
    try{
        const allcate = await this.findOne();
        const subcate = await this.findOne({name: categoryName[0]});
        allcate.count ++;
        subcate.count ++;
        subcate.sub_categories.map(function(item){
            if(item.name == categoryName[1]){
                return item.count ++;
            }
        });

        await allcate.save();
        await subcate.save();
        console.log('保存category成功');
        return;
    }catch(err){
        console.log('保存category失败');
        throw new Error(err);
    }
}

const category = mongoose.model('Category',categorySchema);

category.findOne(function(err,data){
    if(!data){
        categoryData.forEach(function(item){
            category.create(item);
        });
    }
})

module.exports = category;