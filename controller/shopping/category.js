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
}