const entryModel = require('../../models/v2/entry.js');

class Entry {
    constructor(){
        
    }

    async getEntry(req,res,next){
        try{
            const entries = await entryModel.find({},'-_id');
            res.send(entries);
        }catch(err){
            console.log('获取数据失败',err);
            res.send({
                status : 0,
                type : 'ERROR_DATA',
                message : '获取数据失败'
            });
        }
    }

}

module.exports = new Entry();