const AddComponent = require('../../prototype/addressComponent.js');
const categoryHandle = require('./category.js');
const shopModel = require('../../models/shopping/shop.js');

class Shop extends AddComponent {
    constructor(){
        super();
        this.getRestaurants = this.getRestaurants.bind(this);
    }

    async getRestaurants(req,res,next){
        const { 
            latitude,
            longitude,
            offset = 0,
            limit = 20,
            keyword,
            restaurant_category_id,
            order_by,
            extras,
            delivery_mode = [],
            support_ids = [],
            restaurant_category_ids = []
        } = req.query;

        try{
            if(!latitude){
                throw new Error('latitude参数错误');
            }else if(!longitude){
                throw new Error('longitude参数错误');
            }
        }catch(err){
            console.log('latitude,longitude参数错误');
            res.send({
                status : 0,
                type : 'ERROR_PARAMS',
                message : err.message,
            });
            return;
        }

        let filter = {};
        //获取对应食品种类
        if(restaurant_category_ids.length && Number(restaurant_category_ids[0])){
            const category = await categoryHandle.findById(restaurant_category_ids[0]);
            Object.assign(filter,{category});
        }
        //按照距离,评分,销量等排序
        let sortBy = {};
        if(Number(order_by)){
            switch(Number(order_by)){
                //起送价
                case 1: 
                        Object.assign(sortBy,{float_minimum_order_amount : 1});
                        break;
                //配送速度
                case 2: 
                        Object.assign(filter,{location : {$near : [longitude,latitude]}});
                        break;
                //评分
                case 3:
                        Object.assign(sortBy,{rating : -1});
                        break;
                //智能排序(默认)
                //距离最近
                case 5:
                        Object.assign(filter,{locatoin : {$near : [longitude,latitude]}});
                        break;
                //销量最高
                case 6: 
                        Object.assign(sortBy,{recent_order_num : -1});
                        break;
            }

        }

        //查找配送方式
        if(delivery_mode.length){
            delivery_mode.forEach(item =>{
                if(Number(item)){
                    Object.assign(fileter,{'delivery_mode_id' : Number(item)});
                }
            });
        }

        //查找活动支持方式
        if(support_ids.length){
            const filterArr = [];
            support_ids.forEach(item=>{
                if(Number(item) && (Number(item) !== 8)){
                    filterArr.push(Number(item));
                }else if(Number(item) == 8){
                    Object.assign(fileter,{is_premium : true});
                }
            })

            if(filterArr.length){
                //匹配同时拥有多种活动的数据
                Object.assign(fileter,{'support_id' : {$all : filterArr}});
            }
        }
        console.log(filter);
        const restaurants = await shopModel.find(filter,'-_id').sort(sortBy).limit(Number(limit)).skip(Number(offset));
        const from = latitude + ',' + longitude;
        let to = '';
        restaurants.forEach((item,index) =>{
            const splitStr = (index == restaurants.length - 1) ? '' : '|';
            to += item.latitude + ',' + item.longitude + splitStr;
        });
        try{
            if(restaurants.length){
                const distance_duration = await this.getDistance(from,to);
                restaurants.map((item,index)=>{
                    return Object.assign(item,distance_duration[index]);
                });
            }
        }catch(err){
            console.log('从addressComponent获取测距数据失败',err);
            restaurants.map((item,index => {
                return Object.assign(item,{distance: '10公里', order_lead_time: '40分钟'});
            }));
        }

        try{
            res.send(restaurants);
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_SHOP_LIST',
                message: '获取店铺列表数据失败',
            })
        }
    }

    //搜索餐馆
    async searchRestaurant(req,res,next){
        const {geohash,keyword} = req.query;
        try{
            if(!geohash || geohash.indexOf(',') == -1){
                throw new Error('经纬度参数错误');
            }else if(!keyword){
                throw new Error('关键词参数错误');
            }
        }catch(err){
            console.log('搜索商铺参数错误');
            res.send({
                status : 0,
                type: 'ERROR_PARAMS',
                message: err.message,
            });
        }

        try{
            const restaurants = await shopModel.find({'name' : eval('/' + keyword + '/gi')},'-_id').limit(50);
            if(restaurants.length) {
                const [latitude,longitude] = geohash.split(',');
                const from = latitude + ',' + longitude;
                let to = '';
                //获取百度地图测距离所需经纬度
                restaurants.forEach((item,index)=> {
                    const splitStr = (index == restaurants.length - 1) ? '' : '|';
                    to += item.latitude + ',' + item.longitude + splitStr;
                });
                const distacne_duration = await this.getDistance(from,to);
                restaurants.map((item,index) =>{
                    return Object.assign(item,distacne_duration[index]);
                });

                res.send(restaurants);
            }
        }catch(err){
            console.log('搜索餐馆数据失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '搜索餐馆数据失败',
            });
        }

    }
}

module.exports = new Shop();