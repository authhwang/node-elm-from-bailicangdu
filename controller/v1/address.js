const BaseComponent = require('../../prototype/baseComponent');
const formidable = require('formidable');


class Address extends BaseComponent {
        constructor(){
            super();
        }

        async getAddress(req,res,next){
            const user_id = req.params.user_id;
            if(!user_id || !Number(user_id)){
                res.send({
                    type: 'ERROR_USER_ID',
                    message: 'user_id参数错误'
                });
                return;
            }

            try{
                const addressList = await AddressModel({user_id},'-_id');
                res.send(addressList);
            }catch(err){
                console.log('获取收货地址失败',err);
                res.send({
                    type: 'ERROR_GET_ADDRESS',
                    message: '获取地址列表失败',
                });
            }
        }

}

module.exports = new Address();