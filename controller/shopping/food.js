const BaseComponent = require('../../prototype/baseComponent.js');
const formidable = require('formidable');
const {food:foodModel,menu:menuModel} = require('../../models/shopping/food.js');
const shopModel = require('../../models/shopping/shop.js');
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
        this.addFood = this.addFood.bind(this);
        this.updateFood = this.updateFood.bind(this);
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

    //增加商铺中的食品
    async addFood(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async(err,fields,files) =>{
            try{
                if(!fields.name){
                    throw new Error('必须填写食品名称');
                }else if(!fields.image_path){
                    throw new Error('必须上传食品图片');
                }else if(!fields.specs.length){
                    throw new Error('至少填写一种规格');
                }else if(!fields.category_id){
                    throw new Error('食品类型ID错误');
                }else if(!fields.restaurant_id){
                    throw new Error('餐馆ID错误');
                }
            }catch(err){
                console.log('前台参数错误',err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                });
                return;
            }

            let category;
            let restaurant;
            try{
                category = await menuModel.findOne({id: fields.category_id});
                restaurant = await shopModel.findOne({id: fields.restaurant_id});
            }catch(err){
                console.log('获取食品类型和餐馆信息失败',err);
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败'
                });
                return;
            }

            let item_id;
            try{
                item_id = await this.getId('item_id');
            }catch(err){
                console.log('获取item_id失败');
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败'
                });
                return;
            }
            
            const rating_count = Math.ceil(Math.random()*1000);
            const month_sales = Math.ceil(Math.random()*1000);
            const tips = rating_count + '评价 月售' + month_sales + '份';
            const newFood = {
                name: fields.name,
                description: fields.description,
                image_path: fields.image_path,
                activity: null,
                attributes: [],
                restaurant_id: fields.restaurant_id,
                category_id: fields.category_id,
                satisfy_rate: Math.ceil(Math.random()*100),
                satisfy_count: Math.ceil(Math.random()*1000),
                item_id,
                rating: (4 + Math.random()).toFixed(1),
                rating_count,
                month_sales,
                tips,
                specfoods: [],
                specifications: [],
            };
            if(fields.activity){
                newFood.activity = {
                    image_text_color: 'f1884f',
                    icon_color: 'f07373',
                    image_text: fields.activity,
                }
            }

            if(fields.attributes){
                fields.attributes.forEach(item => {
                    let attr;
                    switch(item){
                        case '新':
                            attr = {
                                icon_color: '5ec452',
                                icon_name: '新'
                            };
                            break;
                        case '招牌': 
                            attr = {
                                icon_color: 'f07373',
                                icon_name: '招牌'
                            };
                            break;
                    }
                    newFood.attributes.push(attr);
                });
            }

            try{
                const [specfoods,specifications] = await this.getSpecfoods(fields,item_id);
                newFood.specfoods = specfoods;
                newFood.specifications = specifications;
            }catch(err){
                console.log('添加specs失败',err);
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败',
                });
                return;
            }

            try{
                const foodEntity = await foodModel.create(newFood);
                category.foods.push(foodEntity);
                category.markModified('foods');      //之后用了混合类型 当进行修改时 则必须调用markModified
                await category.save();
                res.send({
                    status: 1,
                    success: '添加食品成功'
                });
            }catch(err){
                console.log('保存食品到数据库失败',err);
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败'
                });
            }
        });
    }

    //添加食品的规格 价钱等
    async getSpecfoods(fields,item_id){
        let specfoods = [], specifications = [];
        if(fields.specs.length < 2){
            let food_id,sku_id;
            try{
                sku_id = await this.getId('sku_id');
                food_id = await this.getId('food_id');
            }catch(err){
                throw new Error('获取sku_id、food_id失败');
            }

            specfoods.push({
                packing_fee: fields.specs[0].packing_fee,
                price: fields.specs[0].price,
                specs: [],
                specs_name: fields.specs[0].specs,
                name: fields.name,
                item_id,
                sku_id,
                food_id,
                restaurant_id: fields.restaurant_id,
                recent_rating: (Math.random()*5).toFixed(1),
                recent_popularity: Math.ceil(Math.random()*1000),       
            });
        }else {
            specifications.push({
                values: [],
                name: '规格',
            });
            for(let i=0;i<fields.specs.length;i++){
                let food_id,sku_id;
                try{
                    sku_id = await this.getId('sku_id');
                    food_id = await this.getId('food_id');
                }catch(err){
                    throw new Error('获取sku_id,food_id失败');
                }
                specfoods.push({
                    packing_fee: fields.specs[i].packing_fee,
                    price: fields.specs[i].price,
                    specs: [{
                        name: '规格',
                        value: fields.specs[i].specs
                    }],
                    specs_name: fields.specs[i].specs,
                    name: fields.name,
                    item_id,
                    sku_id,
                    food_id,
                    restaurant_id: fields.restaurant_id,
                    recent_rating: (Math.random()*5).toFixed(1),
                    recent_popularity: Math.ceil(Math.random()*1000),
                });
                specifications[0].values.push(fields.specs[i].specs);
            }

        }
        return [specfoods,specifications];
    }

    //获取食品列表
    async getMenu(req,res,next){
        const restaurant_id = req.query.restaurant_id;
        const allMenu = req.query.allMenu;
        if(!restaurant_id || !Number(restaurant_id)){
            console.log('获取餐馆参数ID错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '餐馆ID参数错误',
            });
            return;
        }
        let filter;
        if(allMenu){
            filter = {restaurant_id};
        }else {
            filter = {restaurant_id,$where: function(){return this.foods.length}}; //根据this.foods是否有数据决定输出
        }
        try{
            const menu = await menuModel.find(filter,'-_id');
            res.send(menu);
        }catch(err){
            console.log('获取食品数据失败',err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取食品数据失败'
            });
        }
    }

    //获取食品种类列表
    async getCategory(req,res,next){
        const restaurant_id = req.params.restaurant_id;
        try{
            const category_list = await menuModel.find({restaurant_id});
            res.send({
                status: 1,
                category_list
            });
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_DATA',
                message: '获取数据失败'
            });
        }
    }

    //获取食品列表
    async getFoods(req,res,next){
        const {limit = 20, offset = 0, restaurant_id} = req.query;
        try{
            let filter = {};
            if(restaurant_id && Number(restaurant_id)){
                filter = {restaurant_id};
            }
            const foods = await foodModel.find(filter,'-_id').sort({item_id: -1}).limit(Number(limit)).skip(Number(offset));
            res.send(foods);
        }catch(err){
            console.log('获取食品数据失败',err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取食品数据失败'
            });
        }
    }

    //获取食品的数量
    async getFoodsCount(req,res,next){
        const restaurant_id = req.query.restaurant_id;
        try{
            let filter = {};
            if(restaurant_id && Number(restaurant_id)){
                filter = {restaurant_id};
            } 
            const count = await foodModel.find(filter).count();
            res.send({
                status: 1,
                count
            });
        }catch(err){
            console.log('获取食品数量失败',err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取食品数量失败'
            });
        }
    }

    //获取食品种类详情
    async getMenuDetail(req,res,next){
        const category_id = req.params.category_id;
        if(!category_id || !Number(category_id)){
            console.log('获取Menu详情参数ID错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'Menu ID参数错误'
            });
            return;
        }
        try{
            const menu = await menuModel.findOne({id: category_id},'-_id');
            res.send(menu);
        }catch(err){
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取Menu详情失败'
            });
        }
    }
    
    //更新食物详情
    async updateFood(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async (err,fields,files)=>{
            if(err){
                console.log('获取食物信息form出错',err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误'
                });
                return;
            }
            const {name, item_id, description ='' , image_path, category_id, new_category_id} = fields;
            try{
                if(!name){
                    throw new Error('食物名称错误');
                }else if(!item_id || !Number(item_id)){
                    throw new Error('食品ID错误');
                }else if(!category_id || !Number(category_id)){
                    throw new Error('食品分类ID错误');
                }else if(!image_path){
                    throw new Error('食品图片地址错误');
                }
                const [specfoods, specifications] = await this.getSpecfoods(fields,item_id);
                let newData;
                if(new_category_id !== category_id && new_category_id !== undefined){
                    newData = {name, description, image_path, category_id: new_category_id, specfoods, specifications};
                    const food = await foodModel.findOneAndUpdate({item_id}, {$set: newData});
                    const menu = await menuModel.findOne({id: category_id});
                    const targetMenu = await menuModel.findOne({id: new_category_id});

                    let subFood = menu.foods.id(food._id);
                    subFood.set(newData);
                    targetMenu.foods.push(subFood);
                    targetMenu.markModified('foods');
                    await targetMenu.save();
                    await subFood.remove();
                    await menu.save();
                }else{

                    newData = {name, description, image_path, specfoods, specifications};
                    const food = await foodModel.findOneAndUpdate({item_id},{$set: newData});
                    const menu = await menuModel.findOne({id: category_id});

                    let subFood = menu.foods.id(food._id);
                    subFood.set(newData);

                    await menu.save();
                }
                res.send({
                    status: 1,
                    success: '修改食品信息成功'
                });
            }catch(err){
                console.log(err.message,err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_FOOD',
                    message: '更新食品信息失败'
                });
            }
        });
    }

    //删除食品
    async deleteFood(req,res,next){
        const food_id = req.params.food_id;
        if(!food_id || !Number(food_id)){
            console.log('food_id参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'food_id参数错误'
            });
            return;
        }
        try{
            const food = await foodModel.findOne({item_id: food_id});
            const menu = await menuModel.findOne({id: food.category_id});
            let subFood = menu.foods.id(food._id);
            await subFood.remove();
            await menu.save();
            await food.remove();
            res.send({
                status: 1,
                success: '删除食品成功'
            });
        }catch(err){
            console.log('删除食品失败',err);
            res.send({
                status: 0,
                type: 'DELETE_FOOD_FAILED',
                message: '删除食品失败'
            });
        }
    }

}

module.exports = new Food();