const AddressComponent = require('../../prototype/addressComponent.js');
const adminModel = require('../../models/admin/admin.js');
const dtime = require('time-formater');
const formidable = require('formidable');
const crypto = require('crypto');

class Admin extends AddressComponent {
    constructor(){
        super();
        this.login = this.login.bind(this);
    }
    async login(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async(err,fields,files) =>{
            if(err){
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: '表单信息错误'
                });
                return;
            }
            const {user_name,password,status = 1} = fields;
            try{
                if(!user_name){
                    throw new Error('用户名参数错误');
                }else if(!password){
                    throw new Error('密码参数错误');
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAMS',
                    message: err.message
                });
                return;
            }

            const newpassword = this.encryption(password);
            try{
                const admin = await adminModel.findOne({user_name},'-_id');
                if(!admin){
                    const adminTip = status == 1 ? '管理员' : '超级管理员';
                    const admin_id = await this.getId('admin_id');
                    const cityInfo = await this.guessPosition(req);
                    const newAdmin = {
                        user_name,
                        password: newpassword,
                        id: admin_id,
                        create_time: dtime().format('YYYY-MM-DD HH:mm'),
                        admin: adminTip,
                        status,
                        city: cityInfo.city
                    };
                    await adminModel.create(newAdmin);
                    req.session.admin_id = admin_id;
                    res.send({
                        status: 1,
                        success: '注册管理员成功'
                    });
                }else if(newpassword.toString() !== admin.password.toString()){
                    console.log('管理员密码错误');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '该用户已存在,密码输入错误'
                    });
                }else {
                    req.session.admin_id = admin.id;
                    res.send({
                        status: 1,
                        message: '登陆成功'
                    });
                }
            }catch(err){
                console.log('登陆管理员失败',err);
                res.send({
                    status: 0,
                    type: 'LOGIN_ADMIN_FAILED',
                    message: '登陆管理员失败'
                });
            }
        });
    }

    async signout(req,res,next){
        try{
            delete req.session.admin_id;
            res.send({
                status: 1,
                message: '退出成功'
            });
        }catch(err){
            console.log('退出失败');
            res.send({
                status: 0,
                message: '退出失败'
            });
        }
    }  

    async getAdminInfo(req,res,next){
        const admin_id = req.session.admin_id;
        if(!admin_id){
            console.log('获取管理员的session数据失败');
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '获取管理员信息失败'
            });
            return;
        }

        try{
            const info = await adminModel.findOne({id: admin_id},'-_id -__v -password');
            if(!info){
                throw new Error('获取管理员信息失败');
            }
            res.send({
                status: 1,
                data: info
            });
        }catch(err){
            console.log('获取管理员信息失败');
            res.send({
                status: 0,
                type: 'GET_ADMIN_INFO_FAILED',
                message: err.message
            });
        }
    }

    async getAllAdmin(req,res,next){
        const {limit = 20,offset = 0} = req.query;
        try{
            const admins = await adminModel.find({},'-_id -password').sort({id: -1}).limit(Number(limit)).skip(Number(offset));
            res.send({
                status: 1,
                data: admins
            });
        }catch(err){
            console.log('获取所有管理员数据失败',err);
            res.send({
                status: 0,
                type: 'ERROR_GET_ADMIN_LIST',
                message: '获取所有管理员数据失败'
            });
        }
    }

    async getAdminCount(req,res,next){
        try{
            const count = await adminModel.count();
            res.send({
                status: 1,
                count
            });
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_ADMIN_COUNT',
                message: '获取管理员数量失败'
            });
        }
    }

    encryption(password){
        const newpassword = this.MD5(this.MD5(password).substr(2,7) + this.MD5(password));
        return newpassword;
    }

    MD5(password){
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}

module.exports = new Admin();