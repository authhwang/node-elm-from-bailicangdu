const statisModel = require('../../models/statis/statis.js');
const userInfoModel = require('../../models/v2/userinfo.js');
const orderModel = require('../../models/bos/order.js');

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

    async apiAllCount(req,res,next){
        try{
            const count = await statisModel.count();
            res.send({
                status: 1,
                count: count
            });
        }catch(err){
            console.log('获取所有api次数失败');
            res.send({
                status: 0,
                type: 'ERROR_GET_ALL_API_COUNT',
                message: '获取所有api次数失败'
            });
        }
    }

    async userCount(req,res,next){
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
            const count = await userInfoModel.find({register_time: eval('/^' + date + '/gi')}).count();
            res.send({
                status: 1,
                count: count
            });
        }catch(err){
            console.log('获取当天注册人数失败',err);
            res.send({
                status: 0,
                type: 'ERROR_GET_USER_REGISTER_COUNT',
                message: '获取当天注册人数失败'
            });
        }
    }

    async orderCount(req,res,next){
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
            const count = await orderModel.find({formatted_created_at: eval('/^' + date + '/gi')}).count();
            res.send({
                status: 1,
                count: count
            });
        }catch(err){
            console.log('获取当天订单数量失败',err);
            res.send({
                status: 0,
                type: 'ERROR_GET_USER_REGISTER_COUNT',
                message: '获取当天订单数量失败'
            });
        }
    }
}

module.exports = new Statis();