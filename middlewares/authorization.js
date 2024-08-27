const jwt = require('jsonwebtoken')
const { statusCode, errorMessage } = require('../helpers/status')

exports.doAuth = async(req, res, next) => {
    try {
        let result;
        if(!req.headers.authorization) throw { message: "Token Invalid" }
        await jwt.verify(req.headers.authorization, process.env.PORTALSI_SALT, function(err, decoded){
            if(err) res.status(statusCode.error).json(errorMessage({error: 'invalid_token', error_description: 'Token is missing'}))
            else result = decoded
        })
    
        req.user = result
        next()
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}