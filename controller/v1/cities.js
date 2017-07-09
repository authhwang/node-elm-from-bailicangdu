const addressComponent = require('../../prototype/addressComponent.js');
const pinyin = require('pinyin');
const Cities = require('../../models/v1/cities.js');

class CityHandle extends addressComponent {

    constructor(){
        super();
        this.getCity = this.getCity.bind(this);
        this.pois = this.pois.bind(this);
    }

    async getCity(req,res,next){
        let cityInfo;
        const type = req.query.type;
        try{
            switch(type){
                case 'guess':
                    const city = await this.getCityname(req,res);
                    cityInfo = await Cities.cityGuess(city);
                    break;
                case 'hot':
                    cityInfo = await Cities.cityHot();
                    break;
                case 'group':
                    cityInfo = await Cities.cityGroup();
                    break;
                default :
                    res.json({
                        name : 'ERROR_QUERY_TYPE',
                        message : '参数错误'
                    });
                    break;
            }
            res.send(cityInfo);
        }catch(err){
            console.error(err);
            res.send({
                name : 'ERROR_DATA',
                message : '获取数据失败',
            });
        }      
    }

    async getCityById(req,res,next){
        const id = req.params.id;
        if(Number.isNaN(id)){
            res.json({
                name : 'ERROR_PARAM_TYPE',
                message : '参数错误'
            });
            return;
        }

        try{
            const cityInfo = await Cities.getCityById(id);
            res.send(cityInfo);
        }catch(err){
            console.error(err);
            res.send({
                name : 'ERROR_DATA',
                message : '获取数据失败',
            });
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

    async pois(req,res,next){

        const geohash = req.params.geohash;
        try{
            if(geohash.indexOf(',') == -1){
                throw new Error('参数错误');
            }
        }catch(err){
            console.log('参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '参数错误',
			})
			return;
        }
        const geoArr = geohash.split(',');
        try{
            const resObj = await this.getPois(geoArr[0],geoArr[1]);
            const address = {
                address : resObj.result.address,
                city : resObj.result.address_component.province,
                geohash,
                latitude: geoArr[0],
				longitude: geoArr[1],
				name: resObj.result.formatted_addresses.recommend,
            }
            res.send(address);
        }catch(err){
            console.log('getpois返回信息失败');
            console.error(err);
            res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '获取数据失败',
			})
        }
    }

}

module.exports = new CityHandle();