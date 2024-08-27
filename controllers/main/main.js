const serviceMain = require('./services')
const db = require('../../config/database/database')
const { validasiFile, validasiFileSize, validasiFormatFile, getDataUser } = require('../../helpers/global_helpers')
const { statusCode, successMessage, errorMessage } = require('../../helpers/status')
const { v4: uuidv4 } = require('uuid');

const updatePayloadReceiverHLog = async (req, result) => {
    const paylogHLog = {
        id_log: req.id_log,
        payload_receiver: JSON.stringify(result)
    }
    return await serviceMain.updateHLog(paylogHLog)
}

exports.getListMenu = async (req, res) => {
    try {
        const dataUser = await getDataUser(req.user)
        const { kd_ref } = req.query
        const find = dataUser.HAKAKSES.find((kd) => kd == kd_ref)
        if (!find) {
            res.status(statusCode.forbidden).json(errorMessage("USER TIDAK MEMILIKI HAK AKSES!!"))
        } else {
            const result = await serviceMain.getListMenu(kd_ref)
            res.status(statusCode.success).json(successMessage(result))
        }
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getAcl = async (req, res) => {
    try {
        const { id_acl } = req.query
        const result = await serviceMain.getAcl(id_acl)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getReferensiByJenis = async (req, res) => {
    try {
        const { jns_ref, keyword } = req.query
        const result = await serviceMain.getReferensiByJenis(jns_ref, keyword)

        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getPermissionCrud = async (req, res) => {
    try {
        const { jns_ref } = req.query
        const { HAKAKSES } = req.user
        const result = await serviceMain.getPermissionCrud(jns_ref, HAKAKSES)

        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertNewProject = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const project_id = uuidv4()
        const dataUser = req.user
        const payload = req.body

        Object.assign(payload, {
            project_id: project_id,
            // project_no: await serviceMain.generateNoProject(project_id),
            project_no: await serviceMain.generateProjectNo(payload?.portofolio_id, payload?.customer_id),
            nip_sales: dataUser?.USERNAME || null,
            nama_sales: dataUser?.NAMA || null,
            created_by: dataUser?.USERNAME || null
        })

        const result = await serviceMain.createDProject(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertCustomer = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const dataUser = req.user
        const payload = req.body
        Object.assign(payload, {
            created_by: dataUser?.USERNAME || null
        })
        payload.customer_id = uuidv4()
        const result = await serviceMain.createCustomer(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))

    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.updateCustomer = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.updateCustomer(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json({
            status: false,
            message: "Gagal Update"
        })
    }
}

exports.insertReferensi = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const dataUser = req.user
        const payload = req.body
        console.log('payload', payload);

        const result = await serviceMain.createReferensi(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))

    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertContactCustomer = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const customer_contact_id = uuidv4()
        const dataUser = req.user
        const payload = req.body
        Object.assign(payload, {
            customer_contact_id: customer_contact_id,
            created_by: dataUser?.USERNAME || null
        })
        const result = await serviceMain.createContactCustomer(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))

    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertPersonilDetail = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const dpersonel_id = uuidv4()
        const dataUser = req.user
        const payload = req.body
        Object.assign(payload, {
            dpersonel_id: dpersonel_id
        })

        const result = await serviceMain.createDPersonilDetail(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertOperationalDetail = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const dataUser = req.user
        const payload = req.body

        if (payload?.cost_id) {
            const result = await serviceMain.updateOperationalDetail(payload)
            updatePayloadReceiverHLog(req, successMessage(result))
            res.status(statusCode.success).json({
                status: true,
                message: result
            })
        } else {
            const cost_id = uuidv4()
            Object.assign(payload, {
                cost_id: cost_id
            })
            const result = await serviceMain.createOperationalDetail(payload, transaction)
            await transaction.commit()
            updatePayloadReceiverHLog(req, successMessage(result))
            res.status(statusCode.success).json(successMessage(result))
        }
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertOperationalDetailDokumen = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const cost_detail_id = uuidv4()
        const dataUser = req.user
        const payload = req.body
        Object.assign(payload, {
            cost_detail_id: cost_detail_id
        })
        const result = await serviceMain.createOperationalDetailDokumen(payload, transaction)
        await transaction.commit()
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertBillingDokumen = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const billing_detail_id = uuidv4()
        const dataUser = req.user
        const payload = req.body
        console.log('dataUser', dataUser);
        Object.assign(payload, {
            billing_detail_id: billing_detail_id,
            created_by: dataUser.IDUSER
        })
        const result = await serviceMain.insertBillingDokumen(payload, transaction)
        await transaction.commit()
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.updateProject = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.updateProject(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json({
            status: true,
            message: result
        })
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json({
            status: false,
            message: "Gagal Update"
        })
    }
}

exports.updateKdStatus = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.updateKdStatus(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json({
            status: true,
            message: result
        })
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json({
            status: false,
            message: "Gagal Update"
        })
    }
}

exports.getListProject = async (req, res) => {
    try {
        const params = req.query
        console.log(params, 'param');

        const result = await serviceMain.getListProject(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListProjectForCostPersonil = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectForCostPersonil(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailCostPersonil = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCostPersonil(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailCostAdvance = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCostAdvance(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailTagihanVendor = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailTagihanVendor(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailCostPersonilDetail = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCostPersonilDetail(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailCostOperasional = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCostOperasional(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailVendorProjectBilling = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailVendorProjectBilling(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailCostOperasionalWithDokumenByCostId = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCostOperasionalWithDokumenByCostId(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListProjectForCostOperasional = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectForCostOperasional(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListProjectForVendorProjectBilling = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectForVendorProjectBilling(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListProjectForCostAdvanced = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectForCostAdvanced(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListProjectForTagihanVendor = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectForTagihanVendor(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getListBillingByTermin = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListBillingByTermin(params)

        // result.status ? 
        res.status(statusCode.success).json(successMessage(result.data))
        // : 
        // res.status(statusCode.bad).json(errorMessage(result.data, "Failed"))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.deletePersonilDetail = async (req, res) => {
    try {
        const dpersonel_id = req.params.dpersonel_id
        const result = await serviceMain.deletePersonilDetail(dpersonel_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteOperationalDetail = async (req, res) => {
    try {
        const cost_id = req.params.cost_id
        const result = await serviceMain.deleteOperationalDetail(cost_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getRefStatusProject = async (req, res) => {
    try {
        const result = await serviceMain.getRefStatusProject()

        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getRefStatus = async (req, res) => {
    try {
        const id_tab_status = req.query.id_tab_status
        const result = await serviceMain.getRefStatus(id_tab_status)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.markAsProject = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.markAsProject(payload, transaction)
        await transaction.commit()

        result.status ?
            res.status(statusCode.success).json(successMessage(result.data, result.message)) :
            res.status(statusCode.bad).json(errorMessage(undefined, result.message))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getPortofolio = async (req, res) => {
    try {
        const result = await serviceMain.getPortofolio()

        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getCustomers = async (req, res) => {
    try {
        const { keyword } = req.query
        const result = await serviceMain.getCustomers(keyword)

        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getStartDate = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getStartDate(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.markAsArchive = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.markAsArchive(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result.data, result.message))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.markAsUnarchive = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const result = await serviceMain.markAsUnarchive(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result.data, result.message))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailProject = async (req, res) => {
    try {
        const { project_id, kode } = req.query
        const { USERNAME } = req.user
        const result = await serviceMain.getDetailProject(project_id, USERNAME, kode)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "Error <<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.getDetailProjectProfile = async (req, res) => {
    try {
        const { project_id } = req.query
        const { USERNAME } = req.user
        const result = await serviceMain.getDetailProjectProfile(project_id, USERNAME)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "Error <<<<<<<")
        res.status(statusCode.error).json(errorMessage(error))
    }
}

exports.insertDokumen = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = (JSON.parse(req.body.payload))
        const { USERNAME } = req.user
        const payloadData = Array.isArray(payload) ? payload : new Array(payload)
        const files = Array.isArray(req.files.lampiran) ? req.files.lampiran : new Array(req.files.lampiran)

        payloadData.forEach(data => Object.assign(data, { created_by: USERNAME }));

        const validasi = await validasiFile(files)
        if (validasi && !validasi.valid) {
            res.status(statusCode.success).json(validasi.data)
        }
        else {
            const result = await serviceMain.insertDokumen(payloadData, files, transaction)
            await transaction.commit()
            updatePayloadReceiverHLog(req, successMessage(result))
            res.status(statusCode.success).json(successMessage(result))
        }

    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.uploadDokumen = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const form = JSON.parse(req.body.dataForm)
        const data = form.data;
        const file = form.file;
        const lampiran = req.files.lampiran
        const ext = file.ext.toLowerCase()

        if (await validasiFileSize(file.size) == true) {
            if (await validasiFormatFile(ext) == true) {
                const result = await serviceMain.processUploadFile(data, lampiran, ext, file);
                res.status(statusCode.success).json({
                    code: '01',
                    message: 'Upload File Sukses',
                    data: result
                })
            } else {
                res.status(statusCode.success).json({
                    code: '02',
                    message: 'Format File Tidak Diizinkan',
                    data: []
                })
            }
        } else {
            res.status(statusCode.success).json({
                code: '02',
                message: 'Ukuran File Melebihi 50 MB',
                data: []
            })
        }
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.error).json({
            code: '02',
            message: 'Upload File Gagal',
            data: error
        })
    }
}

exports.deleteDokumen = async (req, res) => {
    try {
        const dokumen_id = req.params.dokumen_id
        const result = await serviceMain.deleteDokumen(dokumen_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.insertDokumenBAMK = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = (JSON.parse(req.body.payload))
        const { USERNAME } = req.user
        const payloadData = Array.isArray(payload) ? payload : new Array(payload)
        const files = Array.isArray(req.files.lampiran) ? req.files.lampiran : new Array(req.files.lampiran)

        payloadData.forEach(data => Object.assign(data, { created_by: USERNAME }));

        for (const payload of payloadData) {
            const dataProject = payload.project_vendor_id !== '' ? await serviceMain.getDetailProjectVendor(payload.project_id) : await serviceMain.getDetailProject(payload.project_id)

            if (dataProject && dataProject.DOKUMEN_BAMK_ID != null) res.status(statusCode.bad).json({
                code: '02',
                message: 'Dokumen BAMK Sudah Terisi!',
                data: []
            })
        }

        const validasi = await validasiFile(files)
        if (validasi && !validasi.valid) {
            res.status(statusCode.success).json(validasi.data)
        } else {
            const saveDokumen = await serviceMain.insertDokumen(payloadData, files, transaction)
            const result = await serviceMain.saveDokumenBAMK(saveDokumen, payloadData)
            await transaction.commit()
            updatePayloadReceiverHLog(req, successMessage(result))
            res.status(statusCode.success).json(successMessage({ saveDokumen, update_project: result }))
        }

    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteDokumenBAMK = async (req, res) => {
    try {
        const { dokumen_id, project_id } = req.query
        if (!dokumen_id && !project_id) res.status(statusCode.error).json(errorMessage("Dokumen ID / Project ID Tidak Boleh Kosong!"))

        const result = await serviceMain.deleteDokumen(dokumen_id)
        const payloadProject = { dokumen_bamk_id: null, project_id: project_id }
        const updateProject = await serviceMain.updateProject(payloadProject)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage({ delete_dokumen: result, update_project: updateProject }))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.postBillingCollection = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { created_by: USERNAME })
        const result = await serviceMain.postBillingCollection(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getBillingCollection = async (req, res) => {
    try {
        const { project_id } = req.query
        const result = await serviceMain.getBillingCollection(project_id)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteBillingCollection = async (req, res) => {
    try {
        const billing_id = req.params.billing_id
        const result = await serviceMain.deleteBillingCollection(billing_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteBillingDokumen = async (req, res) => {
    try {
        const billing_detail_id = req.params.billing_detail_id
        const result = await serviceMain.deleteBillingDokumen(billing_detail_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.postVendorPlanning = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, payload.project_vendor_id ? { updated_by: USERNAME } : { created_by: USERNAME })
        const result = await serviceMain.postVendorPlanning(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getVendorPlanning = async (req, res) => {
    try {
        const { project_id } = req.query
        const result = await serviceMain.getVendorPlanning(project_id)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteVendorPlanning = async (req, res) => {
    try {
        const project_vendor_id = req.params.project_vendor_id
        const result = await serviceMain.deleteVendorPlanning(project_vendor_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.postCBBPlanning = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { created_by: USERNAME })
        const result = await serviceMain.postCBBPlanning(payload)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getCBBPlanning = async (req, res) => {
    try {
        const { project_id } = req.query
        const result = await serviceMain.getCBBPlanning(project_id)
        console.log(result, "BERHASIL HORE << <<<<")
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteCBBPlanning = async (req, res) => {
    try {
        const cbb_id = req.params.cbb_id
        const result = await serviceMain.deleteCBBPlanning(cbb_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.costPersonilPlanning = async (req, res) => {
    try {
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { created_by: USERNAME })
        const result = await serviceMain.costPersonilPlanning(payload)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getCostPersonilPlanning = async (req, res) => {
    try {
        const { project_id } = req.query
        const result = await serviceMain.getCostPersonilPlanning(project_id)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteCostPersonilPlanning = async (req, res) => {
    try {
        const personel_id = req.params.personel_id
        const result = await serviceMain.deleteCostPersonilPlanning(personel_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.deleteContactCustomer = async (req, res) => {
    try {
        const customer_contact_id = req.params.customer_contact_id
        const result = await serviceMain.deleteContactCustomer(customer_contact_id)
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getSubReferensiByJenis = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getSubReferensiByJenis(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getListVendor = async (req, res) => {
    try {
        const { keyword } = req.query
        const result = await serviceMain.getListVendor(keyword)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.markAsActualID = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const validasi = await serviceMain.validasiPayloadMarkAsActualID(payload)
        if (!validasi.valid) res.status(statusCode.bad).json(errorMessage(validasi.message))
        const result = await serviceMain.markAsActualID(payload, transaction)
        await transaction.commit()
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        if (transaction) await transaction.rollback()
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getListProjectVendor = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListProjectVendor(params)
        res.status(statusCode.success).json(successMessage(result.data))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getDetailProjectVendor = async (req, res) => {
    try {
        const { project_id } = req.query
        const result = await serviceMain.getDetailProjectVendor(project_id)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getProjectByType = async (req, res) => {
    try {
        const { type, keyword } = req.query
        const result = await serviceMain.getProjectByType(type, keyword)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.markAsAcceleration = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { updated_by: USERNAME })
        const validasi = await serviceMain.validasiProjectAkselerasi(payload, '1')
        if (!validasi.valid) res.status(statusCode.bad).json(errorMessage(validasi.message))
        const result = await serviceMain.markAsAcceleration(payload, transaction)
        await transaction.commit()
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        if (transaction) await transaction.rollback()
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.insertProjectStatus = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        const { USERNAME } = req.user
        Object.assign(payload, { created_by: USERNAME, date_status: Date.now() })
        if (!payload.project_id) res.status(statusCode.bad).json(errorMessage("Invalid Project ID cannot be empty!"))
        const result = await serviceMain.insertProjectStatus(payload, transaction)
        await transaction.commit()
        updatePayloadReceiverHLog(req, successMessage(result))
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        if (transaction) await transaction.rollback()
        console.log(error, "ERROR <<<<<<")
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getDetailVendorRealization = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailVendorRealization(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.dataRevenueStream = async (req, res) => {
    let transaction
    try {
        transaction = await db.transaction()
        const payload = req.body
        if (payload.billing_revenue_id == '' || !payload.billing_revenue_id) {
            const result = await serviceMain.dataRevenueStream(payload, transaction)
            await transaction.commit()
            updatePayloadReceiverHLog(req, successMessage(result))
            res.status(statusCode.success).json(successMessage(result))
        } else {
            const result = await serviceMain.dataRevenueStreamUpdate(payload)
            updatePayloadReceiverHLog(req, successMessage(result))
            // if (payload.status_invoice == 'T') {
            //     const payloadStatus = { billing_id: payload.billing_id, kd_status: "401" }
            //     await serviceMain.updateKdStatus(payloadStatus)
            // }
            if (payload.status_pelunasan == 'T') {
                const payloadStatus = { billing_id: payload.billing_id, kd_status: "401" }
                await serviceMain.updateKdStatus(payloadStatus)
            }
            res.status(statusCode.success).json(successMessage(result))
        }
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        if (transaction) await transaction.rollback()
        updatePayloadReceiverHLog(req, errorMessage(error))
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getBillingRealization = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getBillingRealization(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getBillingDocument = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getBillingDocument(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getListBillingRevenue = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListBillingRevenue(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getDetailBillingRevenue = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailBillingRevenue(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getDetailCustomer = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getDetailCustomer(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getListCustomer = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListСustomer(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}

exports.getListReferensi = async (req, res) => {
    try {
        const params = req.query
        const result = await serviceMain.getListReferensi(params)
        res.status(statusCode.success).json(successMessage(result))
    } catch (error) {
        console.log(error, "ERROR <<<<<<")
        res.status(statusCode.bad).json(errorMessage(error.message))
    }
}