const ratingModel = require('../../models/ugc/rating.js');

class Rating {
    constructor(){
        this.type = ['ratings','scores','tags'];
        this.getRatings = this.getRatings.bind(this);
    }
    async initData(restaurant_id){
        try{
            const status = await ratingModel.initData(restaurant_id);
            if(status){
                console.log('初始化评论数据成功');
            }
        }catch(err){
                console.log('初始化评论数据失败',err);
                throw new Error(err);
        }
    }

    async getRatings(req,res,next){
        const restaurant_id = req.params.restaurant_id;
        let offset = 0,limit;
        if(req.query.offset){
            offset = req.query.offset;
        }
        if(req.query.limit){
            limit = req.query.limit;
        }
        if(!restaurant_id || !Number(restaurant_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '餐馆ID参数错误'
            });
            return;
        }
        try{
            const ratings = await ratingModel.getData(restaurant_id,this.type[0],offset,limit);
            res.send(ratings);
        }catch(err){
            console.log('获取评论列表失败',err);
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '未找到当前餐馆的评论数据'
            });
        }
    }

}

module.exports = new Rating();