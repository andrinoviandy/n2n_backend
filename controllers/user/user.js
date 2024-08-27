const serviceUser = require('./services')
const { statusCode, successMessage, errorMessage } = require('../../helpers/status')

exports.login = async(req, res) => {
    try {
        const payload = req.user
        const result = await serviceUser.doLogin(payload)
        
        res.status(statusCode.success).json({
            status: true,
            message: 'Success',
            data: result.token,
            flag: result.hak_akses.result.length > 1 ? true : false,
            access: result.hak_akses.result
        })
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.error).json(errorMessage(error.message))
    }
}