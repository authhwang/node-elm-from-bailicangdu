const BaseComponent = require('../../prototype/baseComponent.js');
const formidable = require('formidable');
const dtime = require('time-formater');
const cartModel = require('../../models/v1/cart.js');
const orderModel = require('../../models/bos/order.js');
const addressModel = require('../../models/v1/address.js');

class Order extends BaseComponent {
    constructor(){
        super();
        this.postOrder = this.postOrder.bind(this);
    }

    async postOrder(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async(err,fields,files) =>{
            if(err){
                console.log('formidable解析出错',err);
                res.send({
                    status: 0,
                    message: '下单失败'
                });
                return;
            }
            const {user_id, cart_id} = req.params;
            const {address_id, come_from = 'mobile_web', deliver_time = '', description, entities, geohash, paymethod_id = 1} = fields;
            try{
                if(!(entities instanceof Array) || !entities.length){
                    throw new Error('entities参数错误');
                }else if(!(entities[0] instanceof Array || !entities[0].length)){
                    throw new Error('entities参数错误');
                }else if(!address_id){
                    throw new Error('address_id参数错误');
                }else if(!user_id || !Number(user_id)){
                    throw new Error('user_id参数错误');
                }else if(!cart_id || !Number(cart_id)){
                    throw new Error('cart参数错误');
                }
            }catch(err){
                console.log(err.message,err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                });
                return;
            }
            let cartDetail;
            let order_id;
            try{
                cartDetail = await cartModel.findOne({id: cart_id});
                order_id = await this.getId('order_id');
            }catch(err){
                console.log('获取数据失败',err);
                res.send({
                    status: 0,
                    type: 'ERROR_GET_DATA',
                    message: '获取订单失败'
                });
                return;
            }

            const deliver_fee = {price: cartDetail.cart.deliver_amount};
            const orderObj = {
                basket: {
                    group: entities,
                    packing_fee: {
                        name: cartDetail.cart.extra[0].name,
                        price: cartDetail.cart.extra[0].price,
                        quantity: cartDetail.cart.extra[0].quantity
                    },
                    deliver_fee
                },
                restaurant_id: cartDetail.cart.restaurant_id,
                restaurant_image_url: cartDetail.cart.restaurant_info.image_path,
                restaurant_name: cartDetail.cart.restaurant_info.name,
                formatted_created_at: dtime().format('YYYY-MM-DD HH:mm'),
                order_time: new Date().getTime(),
                time_pass: 900,
                status_bar: {
                    color: 'f60',
                    image_type: '',
                    sub_title: '15分钟内支付',
                    title: ''
                },
                total_amount: cartDetail.cart.total,
                total_quantity: entities[0].length,
                unique_id: order_id,
                id: order_id,
                user_id,
                address_id,
            }
            try{
                await orderModel.create(orderObj);
                res.send({
                    status: 1,
                    success: '下单成功,请及时付款',
                    need_validation: false
                });
            }catch(err){
                console.log('保存订单数据失败');
                res.send({
                    status: 0,
                    type: 'ERROR_SAVE_ORDER',
                    message: '保存订单失败'
                });
            }
        });
    }

    async getOrders(req,res,next){
        const {user_id} = req.params;
        const {limit = 0,offset = 0} = req.query;
        try{
            if(!user_id || !Number(user_id)){
                throw new Error('user_id参数错误');
            }else if (typeof Number(limit) !== 'number'){
                throw new Error('limit参数错误');
            }else if(typeof Number(offset) !== 'number'){
                throw new Error('offset参数错误');
            }
        }catch(err){
            console.log(err.message,err);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            });
            return;
        }
        try{
            const orders = await orderModel.find({user_id}).sort({id: -1}).limit(Number(limit)).skip(Number(offset));
            const timeNow = new Date().getTime();
            orders.map((item) =>{
                if(timeNow - item.order_time < 900000) {
                    item.status_bar.title = '等待支付';
                }else {
                    item.status_bar.title = '支付超时';
                }
                item.time_pass = Math.ceil((timeNow - item.order_time) / 1000);
                item.save();
                return item;
            });
            res.send(orders);
        }catch(err){
            console.log('获取订单列表失败',err);
            res.send({
                status: 0,
                type: 'ERROR_GET_ORDER_LIST',
                message: '获取订单列表失败'
            });
        }
    }

    async getDetail(req,res,next){
        const {user_id,order_id} = req.params;
        try{
            if(!user_id || !Number(user_id)){
                throw new Error('user_id参数错误');
            }else if(!order_id || !Number(order_id)){
                throw new Error('order_id参数错误');
            }
        }catch(err){
            console.log(err.message);
            res.send({
                status: 0,
                type: 'GET_ERROR_PARAM',
                message: err.message
            });
            return;
        }
        try{
            const order = await orderModel.findOne({id: order_id},'-_id');
            const addressDetail = await addressModel.findOne({id: order.address_id},'-_id');
            const orderDetail = {order,...{addressDetail: addressDetail.address,consignee: addressDetail.name,deliver_time: '尽快送达',pay_method: '在线支付', phone: addressDetail.phone}};
            res.send(orderDetail);
        }catch(err){
            console.log('获取订单信息失败',err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_ORDER_DETAIL',
                message: '获取订单信息失败'
            });
        }
    }

    async getOrdersCount(req,res,next){
        try{
            const count = await orderModel.count();
            res.send({
                status: 1,
                count: count
            });
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_ORDERS_COUNT',
                message: '获取所有订单数量失败'
            });
        }
    }
}

module.exports = new Order();