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
        this.initData = this.initData.bind(this);
    }

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

}

module.exports = new Food();