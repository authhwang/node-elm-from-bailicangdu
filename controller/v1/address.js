const BaseComponent = require('../../prototype/baseComponent');
const addressModel = require('../../models/v1/address.js');
const formidable = require('formidable');

class Address extends BaseComponent {
        constructor(){
            super();
            this.addAddress = this.addAddress.bind(this);
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
                const addressList = await addressModel.find({user_id},'-_id');
                res.send(addressList);
            }catch(err){
                console.log('获取收货地址失败',err);
                res.send({
                    type: 'ERROR_GET_ADDRESS',
                    message: '获取地址列表失败',
                });
            }
        }

        async addAddress(req,res,next){
            const user_id = req.params.user_id;
            if(!user_id || !Number(user_id)){
                res.send({
                    type: 'ERROR_USER_ID',
                    message: 'user_id参数错误'
                });
                return;
            }

            const form = new formidable.IncomingForm();
            form.parse(req,async(err,fields,files) =>{
                const {address,address_detail,geohash,name,phone,tag,sex,poi_type = 0,phone_bk,tag_type} = fields;
                try{
                    if(!address){
                        throw new Error('地址信息错误');
                    }else if(!address_detail){
                        throw new Error('详细地址参数错误');
                    }else if(!geohash){
                        throw new Error('geohash参数错误');
                    }else if(!name){
                        throw new Error('收货人姓名错误');
                    }else if(!phone){
                        throw new Error('收货手机号错误');
                    }else if(!sex){
                        throw new Error('性别错误');
                    }else if(!tag){
                        throw new Error('标签错误');
                    }else if(!tag_type){
                        throw new Error('标签类型错误');
                    }
                }catch(err){
                    console.log(err.message);
                    res.send({
                        status: 0,
                        type: 'GET_WRONG_PARAM',
                        message : err.message
                    });
                    return;
                }

                try{
                    const address_id = await this.getId('address_id');
                    const newAddress = {
                        id: address_id,
                        address,
                        phone,
                        phone_bk: phone_bk || '1213',
                        name,
                        st_geohash: geohash,
                        address_detail,
                        sex,
                        tag,
                        tag_type,
                        user_id,
                    };
                    await addressModel.create(newAddress);
                    res.send({
                        status: 1,
                        success: '添加地址成功'
                    });
                }catch(err){
                    console.log('添加地址失败',err);
                    res.send({
                        status: 0,
                        type: 'ERROR_ADD_ADDRESS',
                        message: '添加地址失败'
                    });
                }
            });
        }

        async delAddress(req,res,next){
            const {user_id, address_id} = req.params;
            if(!user_id || !address_id || !Number(user_id) || !Number(address_id)){
                console.log('参数错误');
                res.send({
                    type: 'ERROR_PARAMS',
                    message: '参数错误'
                });
                return;
            }
            try{
                await addressModel.findOneAndRemove({id: address_id});
                res.send({
                    status: 1,
                    success: '删除地址成功'
                });
            }catch(err){
                console.log('删除收货地址失败',err);
                res.send({
                    status: 0,
                    message: '删除收货地址失败'
                });
            }
        }

}

module.exports = new Address();