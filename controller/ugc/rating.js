const ratingModel = require('../../models/ugc/rating.js');

class Rating {
    constructor(){
        this.type = ['ratings','scores','tags'];
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
}

module.exports = new Rating();