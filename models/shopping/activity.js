const mongoose = require('mongoose');
const activityData = require('../../initDatas/activity.js');

const activitySchema = mongoose.Schema({
    description: String,
    icon_color: String,
    icon_name: String,
    id: Number,
    name: String,
    ranking_weight: Number
});

activitySchema.index({id: -1});

const activity = mongoose.model('Activity',activitySchema);
activity.findOne(function(err,data){
    if(!data){
        activityData.forEach(function(item){
            activity.create(item);
        });
    }
})
module.exports = activity;