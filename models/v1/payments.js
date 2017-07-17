const mongoose = require('mongoose');
const paymentsData = require('../../initDatas/payments.js');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    description: String,
    disable_reason: String,
    id: Number,
    is_online_payment: Boolean,
    name: String,
    promotion: [],
    select_state: Number,
});

const payments = mongoose.model('payments',paymentSchema);

payments.findOne(function(err,data){
    if(!data){
        paymentsData.forEach(function(item){
            payments.create(item);
        });
    }
})

module.exports = payments;