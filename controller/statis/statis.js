const statisModel = require('../../models/statis/statis.js');

class Statis {
    constructor(){
        
    }

    async apiCount(req,res,next){
        const date = req.params.date;
        if(!date){
            console.log('参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARMAS',
                message: '参数错误'
            });
            return;
        }
        try{
            const count = await statisModel.find({date}).count();
            res.send({
                status: 1,
                count: count
            });
        }catch(err){
            console.log('获取当天API次数失败');
            res.send({
                status: 0,
                type: 'ERROR_GET_API_COUNT',
                message: '获取当天api次数失败'
            });
        }
    }
}

module.exports = new Statis();