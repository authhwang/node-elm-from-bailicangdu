const baseComponent = require('./baseComponent.js');

class AddressComponent extends baseComponent {
    constructor(){
        super();
        this.tencentkey = 'RF2BZ-RZSWW-P23RN-R7DL6-QCRLT-BCFSS';
        this.baidukey = 'oyNsUsq5EdRERw0aGsyjEn28bHXNm0ly';
    }

    //通过ip定位地址
    async guessPosition(req) {
        //x-forwarded-for http的请求端真实ip 通常在通过负载均衡或者其他类型的代理 会添加这个信息
        //req.connection.remoteAddress connection 其实是一个socket对象 假如不是代理就用这个
        return new Promise(async (resolve,reject) => {
            let ip = req.connection.remoteAddress || req.headers['x-forwardded-for'];
            //127.0.0.1:80
            const ipArr = ip.split(':');
            ip = ipArr[ipArr.length - 1];
            //上线的代理服务器估计是
            // if(process.env.NODE_ENV == 'development') {
            //     ip = '116.226.184.83'
            // }
            ip = '113.103.23.60';
            try{
                let result;
                //通过ip定位地址
                result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip',{
                    ip : ip,
                    key : this.tencentkey,
                });

                if(result.status == 0){
                    const cityInfo = {
                        lat : result.result.location.lat,
                        lng : result.result.location.lng,
                        city : result.result.ad_info.city,
                    }
                    cityInfo.city = cityInfo.city.replace(/市$/,''); //除去市字
                    resolve(cityInfo);
                }else {
                    console.log('定位失败',result);
                    reject('定位失败');
                }
            }catch(err){
                console.log('不知道出了啥问题',err);
                reject(err);
            }
        });
    }
}


module.exports = AddressComponent;