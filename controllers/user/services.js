const jwt = require('jsonwebtoken');
const api = require('./api')
const helpers = require('./../../helpers/global_helpers')


exports.doLogin = async(payload) => {
    const dataLogin = await api.portalsiLogin(payload) 
    if(dataLogin.status == "E"){
        throw {
            kode: dataLogin.kode,
            message: dataLogin.pesan
        }
    } else {
        const hak_akses = await helpers.getDataUser(dataLogin)
        const token = await this.encodedJwt(dataLogin)
        return {
            hak_akses: hak_akses,
            token: token
        }
    }
}

exports.encodedJwt = async(data) => {
    const result = await jwt.sign(data, process.env.PORTALSI_SALT, { algorithm: 'HS256' })
    return result
}

exports.decodedJwt = async(data) => {
    let result;
    await jwt.verify(data, process.env.PORTALSI_SALT, function(err, decoded){
        console.log(err, decoded, "DECODED <<<<<<<<")
        if(err) throw {
            name: 'JsonWebTokenError',
            message: 'jwt malformed'
        }
        else result = decoded
    })

    return result
}