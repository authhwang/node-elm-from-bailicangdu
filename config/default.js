module.exports = {
    qiniu : {
        'AccsessKey' : 'aVxUcud5HTVh-S_rRAaLEYxIo4yXR6CLz2qgHcNU',
        'SecretKey' : 'B0M4hPu4gwFsbG2Ze4ml6KyjGJyCrLbO2YgWxw-4'
    },
    port : 8001,
    url: 'mongodb://localhost:27017/elm',
    session: {
        name: 'SID',
        secret : 'session与cookie密钥',
        cookie : {
            maxAge : 365 * 24 * 60 * 1000,
            secure: false,
            httpOnly: true
        }
    }
}