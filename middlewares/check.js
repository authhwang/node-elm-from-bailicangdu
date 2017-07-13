const adminModel = require('../models/admin/admin.js');

class Check {
    constructor(){

    }

    async checkAdmin(req,res,next){
        const admin_id = req.session.admin_id;
        if(!admin_id || !Number(admin_id)){
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '亲,您还没有登陆',
            });
        }else {
            const admin = await adminModel.findOne({id: admin_id});
            if(!admin){
                res.send({
                    status: 0,
                    type: 'HAS_NO_ACCESS',
                    message: '权限不足,请联系管理员提升权限'
                });
                return;
            }
        }
        next();
    }

}