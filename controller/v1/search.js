const addressComponent = require('../../prototype/addressComponent.js');
const cityHandle = require('./cities.js');
const Cities = require('../../models/v1/cities.js');

class SearchPlace extends addressComponent {

        constructor(){
            super();
            this.search = this.search.bind(this);
        }
        
        
        async search(req,res,next){
            let {type = 'search',city_id,keyword} = req.query;
            if(!keyword){
                res.send({
                    name : 'ERROR_QUERY_TYPE',
                    message : '参数错误'
                });
            }else if(isNaN(city_id)){
                try{
                    console.log('原 city_id : \n' + city_id);

                    const cityname = await cityHandle.getCityname(req);
                    const cityinfo = await Cities.cityGuess(cityname);
                    city_id = cityinfo.id;
                }catch(err){
                    console.log('搜索地址时,获取定位域失败');
                    res.send({
                        name: 'ERROR_GET_POSITION',
                        message: '获取数据失败',
                    });
                }
            }

            try{
                const cityinfo = await Cities.getCityById(city_id);
                const resultObj = await this.searchPlace(keyword,cityinfo.name,type);
                const cityList = [];
                resultObj.data.forEach((item,index) =>{
                    cityList.push({
                        name : item.title,
                        address : item.address,
                        latitude : item.location.lat,
                        longitude : item.location.lng,
                        geohash : item.location.lat + ',' + item.location.lng, 
                    });
                });
                res.send(cityList);
            }catch(err){
                console.error(err);
                res.send({
                    name: 'GET_ADDRESS_ERROR',
                    message: '获取地址信息失败',
                });
            }
        }
}

module.exports = new SearchPlace();