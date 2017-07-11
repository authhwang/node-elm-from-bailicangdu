const mongoose = require('mongoose');
const deliveryData = require('../../initDatas/delivery.js');

const deliverySchema = mongoose.Schema({
    color: String,
    id: Number,
    is_solid: Boolean,
    text: String
});

deliverySchema.index({id: 1});
const delivery = mongoose.model('Delivery',deliverySchema);

delivery.findOne(function(err,data){
    if(!data){
        delivery.create(deliveryData);
    }
})

module.exports = delivery;