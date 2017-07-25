const fetch = require('node-fetch');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const qiniu = require('qiniu');
const config = require('config-lite')(__dirname);
const Ids = require('../models/ids.js')
qiniu.conf.ACCESS_KEY = config.qiniu.AccsessKey;
qiniu.conf.SECRET_KEY = config.qiniu.SecretKey;

module.exports = class BaseComponent {
    constructor(){
        this.idList = ['restaurant_id','food_id','order_id','user_id'
                            ,'address_id','cart_id','img_id','category_id','item_id'
                                ,'sku_id','admin_id','statis_id'];
        this.imgTypeList = ['shop','food','avatar','default'];
        this.uploadImg = this.uploadImg.bind(this);
        this.qiniu = this.qiniu.bind(this); //单独导出时会时this指向不明 所以需要此绑定 不过只是应用在export es6的新功能 
            //怪不得要这样写了 因为假如用了箭头函数 在一些第三方的回调下使用this回变得指向不明 估计会在第三方那里 所以才要这样
    }

    async fetch (url = '',data = {},type = 'GET',resType = 'JSON') {
        type = type.toUpperCase();
        resType = resType.toUpperCase();

        if(type == 'GET') {
            let dataStr = '';
            Object.keys(data).forEach(function(key){
                dataStr += key + '=' + data[key] + '&';
            });
            
            if(dataStr !== '') {
                dataStr = dataStr.substr(0,dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
                console.log(url);
            }
        }

        let requestConfig = {
            method : type,
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            }
        }

        if(type == 'POST') {
            Object.definePropertie(requestConfig,'body',{
                value : JSON.stringify(data)
            })
        }

        let responseJson;

        try {
            const response = await fetch(url,requestConfig);
            if(resType === 'TEXT') {
                responseJson = await response.text();
            }else {
                responseJson = await response.json();
            }
        } catch(err) {
            console.log('获取http数据失败');
            throw new Error(err);
        }

        return responseJson;
    }
    
    async getId(type) {
        if(!this.idList.includes(type)){
            console.log('id类型错误');
            throw new Error('id类型错误');
        }
        try{
            //TODO 类型的模型等我app.js做完先再处理
            const idData = await Ids.findOne();
            idData[type] ++;
            await idData.save();
            return idData[type];
        }catch(err){
            console.log('获取id数据失败',err);
            throw new Error('获取id类型失败');
        }
    }

    async uploadImg(req,res,next){
        const type = req.params.type;
        try {
            const image_path = await this.qiniu(req,type);
            res.send({
                status: 1,
                image_path
            })
        }catch(err){
            console.log('上传图片失败',err);
            res.send({
                status: 0,
                type: 'ERROR_UPLOAD_IMG',
                message: '上传图片失败'
            })
        }
    }

    async qiniu(req,type = 'default'){
        return new Promise((resolve,reject) =>{
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img/' + type;
            form.parse(req,async (err,fields,files) =>{
                let img_id;
                try{
                    img_id = await this.getId('img_id');
                }catch(err){
                    console.log('获取图片id失败');
                    fs.unlinkSync(files.file.path);
                    reject('获取图片失败');
                }

                const imgName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
                const extName = path.extname(files.file.name);
                const repath = './public/img/' + type + '/' + imgName + extName;
                console.log(repath);
                try {
                    const key = imgName + extName;
                    fs.renameSync(files.file.path,repath);
                    const token = this.uptoken('node-elm',key);
                    const qiniuImg = await this.uploadFile(token.toString(),key,repath);
                    fs.unlinkSync(repath);
                    resolve(qiniuImg);
                }catch(err) {
                    console.log('保存至七牛失败');
                    fs.unlinkSync(repath);
                    reject('保存至七牛失败');
                }
            });
        });
    }

    uptoken(bucket,key){
        try {
            const putPolicy = new qiniu.rs.PutPolicy(bucket+':'+key);
            return putPolicy.token();
        }catch(err){
            console.log(err);
        }
    }

    uploadFile(uptoken,key,localFile){
        return new Promise((resolve,reject) =>{
            var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(uptoken,key,localFile,extra,function(err,ret){
                if(!err){
                    resolve(ret.key);
                }else {
                    console.log('图片上传至七牛失败',err);
                    reject(err);
                }
            })
        });
    }
}
