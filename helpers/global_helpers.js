const jwt = require('jsonwebtoken')
const path = require('path');

exports.encodedJwt = async(data) => {
    const token = await jwt.sign(data, process.env.PORTALSI_SALT, { algorithm: 'HS256' })
    return token
}
exports.statusUpdate = async(status) => {
    const updated = status[0] == 1 ? true : false
    return {
        status: updated,
        message: updated ? "Success" : "Failed"
    }
}

exports.isNotEmpty = (data) => {
	let result = true
	switch (result) {
		case data == '':
			// console.log("string")
			result = false
			break;
		case data == undefined:
			result = false
			// console.log(data, result, "undefined, result false <<<<<<<<<<<<")
			break;
		case data == null:
			// console.log("null")
			result = false
			break;
		case Array.isArray(data) && data.length == 0:
			// console.log("array")
			result = false
			break;
		case typeof data === 'object' && Object.entries(data).length == 0:
			// console.log("object")
			result = false
			break;
		case typeof data === 'number' && isNaN(data):
			// console.log("NaN")
			result = false
			break;
	}

	return result
}

exports.getTypeByStatus = async(status) => {
    switch (status) {
        case '001':
        case '002':
        case '003':    
        case '004':
        case '005':   
            return '01'
        default:
            return null
    }
}

exports.validasiFileSize = async(size) => {
	const allowSize = (size / 1024 / 1024).toFixed(2);
	if (allowSize <= 50) {
		return true;
	} else {
		return false
	}
}

exports.validasiFormatFile = async (ext) => {
	if (ext == '.docx' || ext == '.pdf' || ext == '.xlsx' || ext == '.xls' || ext == '.png' || ext == 'jpg' || ext == 'jpeg' || ext == 'svg') {
		return true
	} else {
		return false
	}
}

exports.validasiFile = async(files) => {
	for (const file of files) {
		const size = file.size
		const format = path.extname(file.name).toLowerCase()
	
		if(await this.validasiFileSize(size)){
			const validasiFormatFile = await this.validasiFormatFile(format)
			if(!validasiFormatFile){
				return {
					valid: false,
					data: {
						code: '02',
						message: 'Format File Tidak Diizinkan',
						data: []
					}
				}
			}
		} else {
			return {
				valid: false,
				data: {
					code: '02',
					message: 'Ukuran File Melebihi 50 MB',
					data: []
				}
			}
		}
	}
}

exports.processUpdate = async(result) => {
	if(result == 1) return "Sukses Update"
	else return "Gagal Update"
}

exports.processDelete = async(result) => {
	if(result == 1) return "Sukses Delete"
	else return "Gagal Delete"
}

exports.getDataUser = async(dataUser) => {
	const { HAKAKSES, HAKAKSES_DESC } = dataUser
	const hak_akses = HAKAKSES.split(',')
	const hak_akses_desc = HAKAKSES_DESC.split(',')
	const result = []

	for (let i = 0; i < hak_akses.length; i++) {
		const data = hak_akses[i];
		const uraian = hak_akses_desc[i]
		result.push({
			kode: data,
			uraian: uraian
		})
	}

	return {
		result,
		HAKAKSES: HAKAKSES.split(','),
		HAKAKSES_DESC: HAKAKSES_DESC.split(',')
	}
}