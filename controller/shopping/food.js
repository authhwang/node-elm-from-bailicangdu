const BaseComponent = require('../../prototype/baseComponent.js');
const formidable = require('formidable');
const {food:foodModel,menu:menuModel} = require('../../models/shopping/food.js');
class Food extends BaseComponent {
    constructor(){
        super();
        this.defaultData = [
            {
                name: '热销榜',
                description: '大家喜欢吃,才叫真好吃',
                icon_url: '',
                is_selected: true,
                type: 1,
                foods: [],
            },
            {
                name: '优惠',
                description: '美味又实惠,大家快来抢!',
                icon_url: '',
                foods: [],
            }
        ];
        //this.initData = this.initData.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    //初始化商铺中的食品数据
    async initData(restaurant_id){
        for(let i= 0;i< this.defaultData.length;i++){
            let category_id;
            try{
                category_id = await this.getId('category_id');
            }catch(err){
                console.log('获取category_id失败');
                throw new Error(err);
            }
            const defaultData = this.defaultData[i];
            const category = {...defaultData,id: category_id,restaurant_id};
            const newFood = new menuModel(category);
            try{
                await newFood.save();
                console.log('初始化食品数据成功');
            }catch(err){
                console.log('初始化食品数据失败');
                throw new Error(err);
            }
        }
    }

    //增加商铺中的食品分类
    async addCategory(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async (err,fields,files) => {
            try{
                if(!fields.name){
                    throw new Error('必须填写食品类型名称');
                }else if(!fields.restaurant_id){
                    throw new Error('餐馆ID错误');
                }else if(!fields.description){
                    throw new Error('必须填写食品种类描述');
                }
            }catch(err){
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                });
                return;
            }
            
            let category_id;
            try{
                category_id = await this.getId('category_id');
            }catch(err){
                console.log('获取category_id失败',err);
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                });
                return;
            }

            const foodObj = {
                name: fields.name,
                description: fields.description,
                restaurant_id : fields.restaurant_id,
                id: category_id,
                foods: []
            };

            const newFood = new menuModel(foodObj);
            try{
                await newFood.save();
                res.send({
                    status: 1,
                    success: '添加食品种类成功'
                });
            }catch(err){
                console.log('保存数据失败');
                res.send({
                    status: 0,
                    type: 'ERROR_IN_SAVE_DATA',
                    message: '保存数据失败'
                });
            }

        });
    }

}

module.exports = new Food();