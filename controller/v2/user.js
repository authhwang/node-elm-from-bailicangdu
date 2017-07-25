const AddressComponent = require('../../prototype/addressComponent.js');
const formidable = require('formidable');
const dtime = require('time-formater');
const userModel = require('../../models/v2/user.js');
const userInfoModel = require('../../models/v2/userinfo.js');
const crypto = require('crypto');

class User extends AddressComponent {
    constructor(){
        super();
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    async login(req,res,next){
        const cap = req.cookies.cap;
        if(!cap){
            console.log('验证码失效');
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效'
            });
            return;
        }

        const form = new formidable.IncomingForm();
        form.parse(req,async (err,fields,files) =>{
            const {username,password,captcha_code} = fields;
            try{
                if(!username){
                    throw new Error('用户名参数错误');
                }else if(!password){
                    throw new Error('密码参数错误');
                }else if(!captcha_code){
                    throw new Error('验证码参数错误');
                }
            }catch(err){
                console.log('登陆参数错误',err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                });
                return;
            }

            if(cap.toString() !== captcha_code.toString()){
                res.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确'
                });
                return;
            }

            const newpassword = this.encryption(password);
            try{
                const user = await userModel.findOne({username},'-_id');
                if(!user){
                    const user_id = await this.getId('user_id');
                    const cityInfo = await this.guessPosition(req);
                    const register_time = dtime().format('YYYY-MM-DD HH:MM');
                    const newUser = {username,password: newpassword ,user_id};
                    const newUserInfo = {username, user_id, id: user_id, city: cityInfo.city, register_time};
                    userModel.create(newUser);
                    const createUser = new userInfoModel(newUserInfo);
                    const userInfo = await createUser.save();
                    req.session.user_id = user_id;
                    res.send(userInfo);
                }else if(user.password.toString() !== newpassword.toString()){
                    console.log('用户登录密码错误');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误'
                    });
                }else {
                    req.session.user_id = user.user_id;
                    const userinfo = await userInfoModel.findOne({user_id: user.user_id},'-_id');
                    res.send(userinfo);
                }
            }catch(err){
                console.log('用户登录失败',err);
                res.send({
                    status: 0,
                    type: 'SAVE_USER_FAILED',
                    message: '登陆失败'
                });
            }
        });
    }


    async getInfo(req,res,next){
        const sid = req.session.user_id;
        const qid = req.query.user_id;
        const user_id = sid || qid;
        if(!user_id || !Number(user_id)){
            console.log('获取用户信息的参数user_id无效',user_id);
            res.send({
                status: 0,
                type: "GET_USER_INFOFAIELD",
                message: '通过session获取用户信息失败'
            });
            return;
        }

        try{
            console.log('user_id: ' + user_id);
            const userinfo = await userInfoModel.findOne({user_id},'-_id');
            res.send(userinfo);
        }catch(err){
            console.log('通过session获取用户信息失败',err);
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取用户信息失败',
            });
        }
    }

    async signout(req,res,next){
        delete req.session.user_id;
        res.send({
            status: 1,
            message: '退出成功'
        });
    }

    async changePassword(req,res,next){
        const cap = req.cookies.cap;
        if(!cap){
            console.log('验证码失败');
            res.send({
                status: 0,
                type: 'ERROR_CAPTHCA',
                message: '验证码失败'
            });
            return;
        }

        const form = new formidable.IncomingForm();
        form.parse(req,async(err,fields,files) =>{
            const {username,oldpassword,newpassword,confirmpassword,captcha_code} = fields;
            try{
                if(!username){
                    throw new Error('用户名参数错误');
                }else if(!oldpassword){
                    throw new Error('必须添加旧密码');
                }else if(!newpassword){
                    throw new Error('必须填写新密码');
                }else if(!confirmpassword){
                    throw new Error('必须填写确认密码');
                }else if(!captcha_code){
                    throw new Error('请填写验证码');
                }else if (newpassword !== confirmpassword){
                    throw new Error('两次密码不一致');
                }
            }catch(err){
                console.log('修改密码参数错误',err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message
                });
                return;
            }

            if(cap.toString() !== captcha_code.toString()){
                res.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确'
                });
                return;
            }

            const md5password = this.encryption(oldpassword);
            try{
                const user = await userModel.findOne({username});
                if(!user){
                    res.send({
                        status: 0,
                        type: 'USER_NOT_FOUND',
                        message: '未找到当前用户'
                    });
                    ;
                }else if(user.password.toString() !== md5password.toString()){
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码不正确'
                    });
                }else {
                    user.password = this.encryption(newpassword);
                    user.save();
                    res.send({
                        status: 1,
                        success: '密码修改正确'
                    });
                }
            }catch(err){
                console.log('修改密码失败',err);
                res.send({
                    status: 0,
                    type: 'ERROR_CHANGE_PASSWORD',
                    message: '修改密码失败'
                });
            }

        });
        
    }

    async getUserCount(req,res,next){
        try{
            const count = await userInfoModel.count();
            res.send({
                status: 1,
                count
            });
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_USER_COUNT',
                message: '获取用户数量失败'
            });
        }
    }

    async getUserList(req,res,next){
        const {limit = 20, offset = 0} = req.query;
        try{
            const users = await userInfoModel.find({},'-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
            res.send(users);
        }catch(err){
            console.log(err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_USERS_LIST',
                message: '获取用户列表失败'
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

module.exports = new User();