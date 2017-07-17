const captchapng = require('captchapng');

class Captchas {
    constructor(){

    }
    async getCaptchas(req,res,next){
        const cap = Number.parseInt(Math.random() * 9000 + 1000);
        const p = new captchapng(80,30,cap);
        p.color(80,80,80,255);
        const base64 = p.getBase64();
        res.cookie('cap',cap,{maxage: 300000,httpOnly: true});
        next();
        res.send({
            status: 1,
            code: 'data:image/png;base64,' + base64,
        });
    }
}

module.exports = new Captchas();