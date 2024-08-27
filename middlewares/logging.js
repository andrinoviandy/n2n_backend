const model = require('../config/model')
const { statusCode, successMessage, errorMessage } = require('../helpers/status')

exports.doLogging = async(req, res, next) => {
    try {
        switch (req.method) {
            case "POST":
            case "PUT":
            case "DELETE":
                const payload_sender = {
                    headers: req.headers || null,
                    parameters: req.query || null,
                    body: req.body,
                }
        
                const payload = {
                    // id_project: null,
                    dest: req.protocol + '://' + req.get('host') + req.originalUrl,
                    nama_service: req.url,
                    method_service: req.method,
                    payload_sender: JSON.stringify(payload_sender, null, 2),
                    created_by: req.ip || null
                }
        
                const createdLog = await model.h_log.create(payload)
        
                req.id_log = createdLog.id_log
                break;
        }

        next()
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}