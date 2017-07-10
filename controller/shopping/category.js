const BaseComponent = require('../../prototype/baseComponent.js');
const categoryModel = require('../../models/shopping/category.js');
class Category extends BaseComponent {
    constructor(){
        super();
    }

    async findById(id){
        try{
            const cateEntity = await categoryModel.findOne({'sub_categories.id' : id});
            let categoryName = CateEntity.name;
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
            })
        }
    }
}