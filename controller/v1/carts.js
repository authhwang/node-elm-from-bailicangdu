const AddressComponent = require('../../prototype/addressComponent.js');
const formidable = require('formidable');
const paymentModel = require('../../models/v1/payments.js');
const shopModel = require('../../models/shopping/shop.js');
const cartModel = require('../../models/v1/cart.js');

class Carts extends AddressComponent {
        constructor(){
            super();
            this.extra = [
                {
                    description: '',
                    name: '餐盒',
                    price: 0,
                    quantity: 1,
                    type: 0,
                }
            ];
            this.checkout = this.checkout.bind(this);
        }

        async checkout(req,res,next){
            const UID = req.session.id;
            const form = new formidable.IncomingForm();
            form.parse(req,async (err,fields,files) =>{
                const {come_from,geohash,entities = [],restaurant_id} = fields;
                try{
                    if(!(entities instanceof Array) || !entities.length){
                        throw new Error('entities参数');
                    }else if(!restaurant_id){
                        throw new Error('restaurant_id参数错误');
                    }
                }catch(err){
                    console.log(err);
                    res.send({
                        status: 0,
                        type: 'ERROR_PARAMS',
                        message: err.message,
                    });
                    return;
                }

                let payments;
                let cart_id;
                let restaurant;
                let delivery_time;
                let delivery_reach_time;
                let from = geohash.split(',')[0] + ',' + geohash.split(',')[1];
                try{
                    payments = await paymentModel.find({},'-_id');
                    cart_id = await this.getId('cart_id');
                    restaurant = await shopModel.findOne({id: restaurant_id},'-_id');
                    const to = restaurant.latitude + ',' + restaurant.longitude;
                    delivery_time = await this.getDistance(from,to,'timevalue');
                    let time = new Date().getTime() + delivery_time * 1000;
                    console.log(time);
                    let hour = ('0' + new Date(time).getHours()).substr(-2);
                    console.log(hour);
                    let minute = ('0' + new Date(time).getMinutes()).substr(-2);
                    console.log(minute);
                    delivery_reach_time = hour + ':' + minute;
                }catch(err){
                    console.log('获取数据失败');
                    res.send({
                        status: 0,
                        type: 'ERROR_DATA',
                        message: err.message,
                    });
                    return;
                }

                const deliver_amount = 4;
                let price = 0;
                entities.map((item)=>{
                    price += item.price * item.quantity;
                    if(item.packing_fee){
                        this.extra[0].price  += item.packing_fee * item.quantity;
                        if(item.specs[0]){
                            return itam.name = item.name + '-' + item.specs[0];
                        }
                    }
                });

                const total = price + this.extra[0].price * this.extra[0].quantity + deliver_amount;
                let invoice = {
                    is_available: false,
                    status_text: '商家不支持开发票'
                };

                restaurant.supports.forEach(item =>{
                    if(item.icon_name == '票'){
                        invoice = {
                            is_available: true,
                            status_text: '商家支持开发票',
                        };
                    }
                });

                const checkInfo = {
                    id: cart_id,
                    cart: {
                        id: cart_id,
                        group: entities,
                        extra: this.extra,
                        deliver_amount,
                        is_deliver_by_fengniao: !!restaurant.deliver_mode,
                        original_total: total,
                        phone: restaurant.phone,
                        restaurant_id,
                        restaurant_info: restaurant,
                        restaurant_minimum_order_amount: restaurant.float_minimum_order_amount,
                        total,
                        user_id: UID,
                    },
                    delivery_reach_time,
                    invoice,
                    sig: Math.ceil(Math.random() * 1000000).toString(),
                    payments,
                }

                console.log("UID : "+ UID);

                try{
                    const newCart =  new cartModel(checkInfo);
                    const cart = await newCart.save();
                    res.send(cart);
                }catch(err){
                    console.log('保存购物车数据失败');
                    res.send({
                        status: 0,
                        type: 'ERROR_TO_SAVE_CART',
                        message: '保存购物车数据失败',
                    });
                }

            });
        }
}

module.exports = new Carts();