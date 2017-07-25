const BaseComponent = require('../../prototype/baseComponent.js');
const categoryModel = require('../../models/shopping/category.js');
const deliveryModel = require('../../models/shopping/delivery.js');
const activityModel = require('../../models/shopping/activity.js');
class Category extends BaseComponent {
    constructor(){
        super();
    }

    async findById(id){
        try{
            const cateEntity = await categoryModel.findOne({'sub_categories.id' : id});
            let categoryName = cateEntity.name;
            cateEntity.sub_categories.forEach(item => {
                if(item.id == id){
                    categoryName += '/' + item.name;
                }
            });
            return categoryName;
        }catch(err){
            console.log('通过category id获取数据失败');
            throw new Error(err);
        }
    }

    //获取所有餐馆分类和数量
    async getCategories(req,res,next){
        try{
            const categories = await categoryModel.find({},'-_id');
            res.send(categories);
        }catch(err){
            console.log('获取categories失败');
            res.send({
                status : 0,
                type: 'ERROR_DATA',
                message: '获取categories失败'
            });
        }
    }

    //获取所有配送方式
    async getDelivery(req,res,next){
        try{
            const deliveries = await deliveryModel.find({},'-_id');
            res.send(deliveries);
        }catch(err){
            console.log('获取配送方式数据失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取配送方式数据失败'
            });
        }
    }

    //获取活动列表
    async getActivity(req,res,next){
        try{
            const activities = await activityModel.find({},'-_id');
            res.send(activities);
        }catch(err){
            console.log('获取活动列表数据失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取活动列表数据失败'
            });
        }
    }

    //增加对应食品种类的数量
    async addCategory(type){
        try{
            await categoryModel.addCategory(type);
        }catch(err){
            console.log('增加category数量失败',err);
            throw new Error(err);
        }
    }
}

module.exports = new Category();