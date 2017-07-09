const mongoose = require('mongoose');
const cityData = require('../../initDatas/cities.js');


//数据是以拼音首字母来排序的
const citySchema = mongoose.Schema({
    data : {}
});

citySchema.statics.cityGuess = function(name){ 
    return new Promise(async (resolve,reject) => {
        const firtWord = name.substr(0,1).toUpperCase();
        console.log(name);
        try{
            const city = await this.findOne();
            //{foo : bar, 1 : 2} = [for,bar],[1,2]
            Object.entries(city.data).forEach(item => {
                if(item[0] == firtWord){
                    item[1].forEach(cityItem => {
                        if(cityItem.pinyin == name){
                            resolve(cityItem);
                        }
                    });
                }
            });
        }catch(err){
            console.err(err);
            reject({
                name: 'ERROR_DATA',
                message : '查找数据失败'
            });
        }
    });
}


citySchema.statics.cityHot = function(){
    return new Promise(async (resolve,reject) => {
        try {
            const city = await this.findOne();
            resolve(city.data.hotCities);
        }catch(err){
            console.err(err);
            reject({
                name: 'ERROR_DATA',
                message : '查找数据失败'
            });
        }
    });
}

citySchema.statics.cityGroup = function(){
    return new Promise(async (resolve,reject) => {
        try {
            const city = await this.findOne();
            const cityObj = city.data;
            //delete(cityObj._id);
            delete(cityObj.hotCities);
            resolve(cityObj);
        }catch(err) {
            console.err(err);
            reject({
                name: 'ERROR_DATA',
                message : '查找数据失败'
            });
        }
    });
}

citySchema.statics.getCityById = function(id){
    return new Promise(async (resolve,reject) => {
        try{
            const city = await this.findOne();
            Object.entries(city.data).forEach(item => {
                if(item[0] !== 'hotCities'){
                    item[1].forEach(cityItem => {
                        if(cityItem.id == id){
                            resolve(cityItem);
                        }
                    });
                }
            });
            resolve('啥都没');
        }catch(err) {
            console.err(err);
            reject({
                name: 'ERROR_DATA',
                message : '查找数据失败'
            });
        }
    });
}


const Cities = mongoose.model('Cities',citySchema);

Cities.findOne(function(err,data){
    if(!data) {
        Cities.create({data : cityData})
    }
})

module.exports = Cities;