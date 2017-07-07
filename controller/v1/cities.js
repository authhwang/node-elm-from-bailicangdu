const addressComponent = require('../../prototype/addressComponent.js');
const pinyin = require('pinyin');
const Cities = require('../../models/v1/cities.js');

class CityHandle extends addressComponent {

    constructor(){
        super();
        this.getCity = this.getCity.bind(this);
    }

    async getCity(req,res,next){
        let cityInfo;
        try{
            const city = await this.getCityname(req,res);
            cityInfo = await Cities.cityGuess(city);
            res.send(cityInfo);
        }catch(err){
            res.send({
                name : 'ERROR_DATA',
                message : '获取数据失败',
            })
        }      
    }


    async getCityname(req){
        let cityInfo;
        try{
            cityInfo = await this.guessPosition(req);
        }catch(err){
            console.error('获取IP位置信息失败',err);
            throw new Error('获取IP位置信息失败');
        }


        //返回[[pin],[yin]]
        const pinyinArr = pinyin(cityInfo.city,{
            style : pinyin.STYLE_NORMAL
        });
        
        let cityName = '';
        pinyinArr.forEach(function(item) {
            cityName += item[0];
        });
        
        return cityName;
    }

}

module.exports = new CityHandle();