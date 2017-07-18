const AddressComponent = require('../../prototype/addressComponent.js');
const formidable = require('formidable');
const dtime = require('time-formater');
const userModel = require('../../models/v2/user.js');

class User extends AddressComponent {
    constructor(){
        super();
    }

    async getInfo(req,res,next){
        const sid = req.session.user_id;
        const qid = req.query.user_id;
        const user_id = sid || qid;
        if(!user_id || !Number(user_id)){
            console.log('获取用户信息的参数user_id无效',user_id);
            res.send({
                status: 0,
                type: "GET_USER_INFOFAIELD",
                message: '通过session获取用户信息失败'
            });
            return;
        }

        try{
            const userinfo = await userModel.findOne({user_id},'-_id');
            res.send(userinfo);
        }catch(err){
            console.log('通过session获取用户信息失败',err);
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取用户信息失败',
            });
        }
    }
}

module.exports = new User();