const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const stripHexPrefix = require('strip-hex-prefix')
const moment = require('moment')
const path = require('path')
const db = require('../../config/database/database')
const model = require('../../config/model')
const query = require('./raw_query')
const helpers = require('../../helpers/global_helpers')
const sequelize = require("sequelize");
const chmodr = require('chmodr');

exports.getListMenu = async (kd_ref) => {
    const result = await db.query(query.getListMenu, {
        replacements: { kd_ref },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    if (result) {
        return JSON.parse(result.DATA)
    } else {
        return {
            "message": "Failed",
            "data": "Data tidak ditemukan!"
        }
    }
}

exports.getAcl = async (id_acl) => {
    const result = await db.query(query.getAcl, {
        replacements: { id_acl },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getReferensiByJenis = async (jns_ref, keyword) => {
    const bind = {
        jns_ref: jns_ref,
        keyword: `%${keyword ? keyword.toUpperCase() : keyword}%`
    }

    const result = await db.query(query.getReferensiByJenis, {
        replacements: bind,
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getPermissionCrud = async (jns_ref, kd_ref) => {
    const bind = { jns_ref: jns_ref, kd_ref: kd_ref }
    const result = await db.query(query.getPermissionCrud, {
        replacements: bind,
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getRoleUser = async (kode) => {
    const result = await db.query(query.getRoleUser, {
        replacements: {kode},
        type: db.QueryTypes.SELECT,
        plain: true
    })

    return result
}

exports.createCustomer = async (payload, transaction) => {
    // const { customer_id } = payload
    const result = await model.m_customer.create(payload, { transaction })
    return {
        ...result.dataValues,
    }
}

exports.createContactCustomer = async (payload, transaction) => {
    const { customer_id } = payload
    const result = await model.m_customer_contact.create(payload, { transaction })
    return {
        ...result.dataValues,
    }
}

exports.createReferensi = async (payload, transaction) => {
    const result = await model.m_referensi.create(payload, { transaction })
    return {
        ...result.dataValues,
    }
}

exports.createDProject = async (payload, transaction) => {
    const { project_id, kd_status, id_tab_status } = payload
    const result = await model.d_project.create(payload, { transaction })

    const payloadProjectStatus = {
        status_id: uuidv4(),
        project_id: project_id,
        kd_status: kd_status,
        date_status: Date.now(),
        type: kd_status == '001' || kd_status == '005' ? '01' : null,
        type_status: 'PR01',
        id_tab_status: id_tab_status
    }
    const resultProjectStatus = await model.d_project_status.create(payloadProjectStatus, { transaction })

    const referensi = await model.m_referensi.findOne({ where: { jns_ref: 'project_type_id', kd_ref: result.project_type_id }, raw: true })
    const portofolio = await model.m_portofolio.findOne({ where: { portofolio_id: result.portofolio_id }, raw: true })


    return {
        project: {
            ...result.dataValues,
            ur_project_type_id: referensi.ur_ref,
            ur_portofolio_id: portofolio.portofolio
        },
        project_status: resultProjectStatus
    }
}

exports.createDPersonilDetail = async (payload, transaction) => {
    const { project_id, kd_status, id_tab_status } = payload
    const result = await model.d_personil_detail.create(payload, { transaction })

    return {
        personil_detail: {
            ...result.dataValues
        }
    }
}

exports.createOperationalDetail = async (payload, transaction) => {
    const { project_id, kd_status, id_tab_status } = payload
    const result = await model.d_cost_opr.create(payload, { transaction })

    return {
        cost: {
            ...result.dataValues
        }
    }
}

exports.updateOperationalDetail = async (payload, transaction) => {
    const { cost_id } = payload

    const result = await model.d_cost_opr.update(payload, { where: { cost_id } })
    return await helpers.processUpdate(result)
}

exports.createOperationalDetailDokumen = async (payload, transaction) => {
    const { project_id, kd_status, id_tab_status } = payload
    const result = await model.d_cost_opr_detail.create(payload, { transaction })

    return {
        ...result.dataValues
    }
}

exports.insertBillingDokumen = async (payload, transaction) => {
    const result = await model.d_billing_dokumen.create(payload, { transaction })

    return {
        ...result.dataValues
    }
}

exports.generateNoProject = async (project_id) => {
    const hex = stripHexPrefix(project_id)
    const upper = hex.toUpperCase();
    const dateNow = moment(Date.now()).format('YYYYMMDD');
    let countProject = await model.d_project.count()

    let total = countProject
    let isValid = false
    while (!isValid) {
        z
        switch (String(countProject).length) {
            case 6:
                total = countProject
                break;
            case 5:
                total = '0' + countProject
                break;
            case 4:
                total = '00' + countProject
                break;
            case 3:
                total = '000' + countProject
                break;
            case 2:
                total = '0000' + countProject
                break;
            case 1:
                total = '00000' + countProject
                break;
            default:
                total = '000001'
                break;
        }
        const tempNomorAju = 'PROJ' + upper.substr(0, 5) + dateNow + total
        const dataProject = await model.d_project.findOne({ where: { project_no: tempNomorAju }, raw: true })

        if (helpers.isNotEmpty(dataProject)) {
            countProject = parseInt(countProject) + 1
        } else {
            isValid = true
        }
    }

    const project_no = 'PROJ' + upper.substr(0, 5) + dateNow + total

    return project_no
}

exports.generateProjectNo = async (portofolio_id, customer_id) => {
    const QUERY = query.projectNo
        .replace(/:portofolio_id/g, portofolio_id)
        .replace(/:customer_id/g, customer_id)

    const project_no = await db.query(QUERY, {
        replacements: {},
        type: db.QueryTypes.SELECT
    })
    return project_no[0].PROJECT_NO
}

exports.getListProject = async ({ status = null, keyword, page, limit, order = 'DESC', tab_status, project_type_id, startDate, endDate }) => {
    const order_by = 'ORDER BY a.CREATED_AT ' + order
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    let archive_condition, condition
    if (project_type_id && project_type_id == '1' && (startDate === '' || endDate === '')) {
        archive_condition = "AND A.KD_STATUS = '004' AND A.PROJECT_TYPE_ID = '1'"
        condition = "WHERE A.KD_STATUS = '004' AND A.PROJECT_TYPE_ID = '1'"
    } else if (project_type_id && project_type_id == '1' && (startDate !== '' && endDate !== '')) {
        archive_condition = `AND A.KD_STATUS = '004' AND A.PROJECT_TYPE_ID = '1' AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        condition = `WHERE A.KD_STATUS = '004' AND A.PROJECT_TYPE_ID = '1' AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
    } else {
        if (startDate !== '' && endDate !== '') {
            archive_condition = tab_status == null ? '' : tab_status == 'SA2' ? `AND a.KD_ARCHIVE = :status AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')` : `AND a.KD_STATUS = :status AND a.KD_ARCHIVE IS NULL AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
            condition = tab_status == null ? '' : tab_status == 'SA2' ? `WHERE a.KD_ARCHIVE = :status AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')` : `WHERE a.KD_STATUS = :status AND a.KD_ARCHIVE IS NULL AND TRUNC(A.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        } else {
            archive_condition = tab_status == null ? '' : tab_status == 'SA2' ? 'AND a.KD_ARCHIVE = :status' : 'AND a.KD_STATUS = :status AND a.KD_ARCHIVE IS NULL'
            condition = tab_status == null ? '' : tab_status == 'SA2' ? 'WHERE a.KD_ARCHIVE = :status' : 'WHERE a.KD_STATUS = :status AND a.KD_ARCHIVE IS NULL'
        }
    }
    const QUERY = query.getListProject
        .replace(/:archive_condition/g, archive_condition)
        .replace(/:order/g, order_by)

    const COUNT_QUERY = query.countListProject.replace(/:condition/g, condition)

    const bindListProject = {
        status: status,
        keyword: `%${keyword ? keyword.toUpperCase() : keyword}%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    if (statusData) { // Get TOTAL COST every project
        for (const [index, project] of listProject.entries()) {
            const dataPersonil = await this.getCostPersonilPlanning(project.PROJECT_ID)
            Object.assign(listProject[index], { "TOTAL_COST": dataPersonil.TOTAL_COST })
        };
    }

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getListProjectForCostPersonil = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY a.CREATED_AT ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(a.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        if (keyword) {
            condition += ` AND (upper(a.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(a.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(a.CONTRACT_NO) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword) {
            condition += `WHERE (upper(a.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(a.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(a.CONTRACT_NO) like upper('%${keyword}%')) `
        }
    }
    const QUERY = query.getListProjectForCostPersonil
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
    const COUNT_QUERY = query.countListProjectForCostPersonil
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getDetailCostPersonil = async ({ project_id }) => {
    const result = await db.query(query.getProjectForCostPersonil, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const listDetail = await db.query(query.getDetailCostPersonil, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return {
        ...result,
        DETAIL_COST: listDetail
    }
}

exports.getDetailCostAdvance = async ({ cost_revenue_id }) => {
    const result = await db.query(query.getDetailCostAdvance, {
        replacements: { cost_revenue_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    return result
}

exports.getDetailTagihanVendor = async ({ billing_revenue_id }) => {
    const result = await db.query(query.getDetailTagihanVendor, {
        replacements: { billing_revenue_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    return result
}

exports.getDetailCostPersonilDetail = async ({ personel_id }) => {
    const result = await db.query(query.getDetailCostPersonilDetail, {
        replacements: { personel_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getDetailCostOperasional = async ({ project_id }) => {
    const result = await db.query(query.getProjectForCostOperasional, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const listDetail = await db.query(query.getDetailCostOperasional, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return {
        ...result,
        DETAIL_COST: listDetail
    }
}

exports.getDetailVendorProjectBilling = async ({ billing_id }) => {
    const result = await db.query(query.getVendorProjectBilling, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const dokumenInvoice = await db.query(query.getDokumenInvoice, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT
    })

    const dokumenPenagihan = await db.query(query.getDokumenPenagihan, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT
    })

    return {
        ...result,
        DOKUMEN_INVOICE: dokumenInvoice,
        DOKUMEN_PENAGIHAN: dokumenPenagihan,
    }
}

exports.getDetailCostOperasionalWithDokumenByCostId = async ({ cost_id }) => {
    const result = await db.query(query.getDetailCostOperasionalWithDokumenByCostId, {
        replacements: { cost_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const listDokumen = await db.query(query.getDetailDokumenCostOperasional, {
        replacements: { cost_id },
        type: db.QueryTypes.SELECT
    })

    return {
        ...result,
        DOKUMEN: listDokumen
    }
}

exports.getListProjectForCostOperasional = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY a.CREATED_AT ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(a.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        if (keyword) {
            condition += ` AND (upper(a.PROJECT_NO) like upper('%${keyword}%')
                                    OR upper(a.PROJECT_NAME) like upper('%${keyword}%')
                                    OR upper(a.CONTRACT_NO) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword) {
            condition += `WHERE (upper(a.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(a.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(a.CONTRACT_NO) like upper('%${keyword}%')) `
        }
    }
    const QUERY = query.getListProjectForCostOperasional
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
        
    const COUNT_QUERY = query.countListProjectForCostOperasional
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getListProjectForVendorProjectBilling = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY a.CREATED_AT ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(a.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        if (keyword) {
            condition += ` AND (upper(c.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(c.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.NO_KONTRAK) like upper('%${keyword}%') 
                        OR upper(m.NAMA_PERUSAHAAN) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword) {
            condition += `WHERE (upper(c.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(c.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.NO_KONTRAK) like upper('%${keyword}%') 
                        OR upper(m.NAMA_PERUSAHAAN) like upper('%${keyword}%')) `
        }
    }

    const QUERY = query.getListProjectForVendorProjectBilling
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
    const COUNT_QUERY = query.countListProjectForVendorProjectBilling
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getListProjectForCostAdvanced = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY a.TANGGAL_COST ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(a.TANGGAL_COST) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        if (keyword && keyword !== '') {
            condition += ` AND (upper(b.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(b.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.CONTRACT_NO) like upper('%${keyword}%') 
                        OR upper(m1.UR_REF) like upper('%${keyword}%') 
                        OR upper(m2.UR_REF) like upper('%${keyword}%') 
                        OR upper(m3.UR_REF) like upper('%${keyword}%') 
                        OR upper(a.DIVISI_ID) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword && keyword !== '') {
            condition += `WHERE (upper(b.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(b.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.CONTRACT_NO) like upper('%${keyword}%') 
                        OR upper(m1.UR_REF) like upper('%${keyword}%') 
                        OR upper(m2.UR_REF) like upper('%${keyword}%') 
                        OR upper(m3.UR_REF) like upper('%${keyword}%') 
                        OR upper(a.DIVISI_ID) like upper('%${keyword}%')) `
        }
    }
    
    const QUERY = query.getListProjectForCostAdvanced
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
    const COUNT_QUERY = query.countListProjectForCostAdvanced
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getListProjectForTagihanVendor = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY d.CREATED_DATE ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(d.CREATED_DATE) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
        if (keyword) {
            condition += ` AND (upper(c.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(c.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.NO_KONTRAK) like upper('%${keyword}%') 
                        OR upper(m.NAMA_PERUSAHAAN) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword) {
            condition += `WHERE (upper(c.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(c.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(b.NO_KONTRAK) like upper('%${keyword}%') 
                        OR upper(m.NAMA_PERUSAHAAN) like upper('%${keyword}%')) `
        }
    }

    const QUERY = query.getListProjectForTagihanVendor
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
    const COUNT_QUERY = query.countListProjectForTagihanVendor
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.getListBillingByTermin = async ({ keyword, page = 1, limit = 10, order = 'ASC', billing_id, project_id }) => {
    const order_by = 'ORDER BY a.PROJECT_ID ' + order + ', b.TERMIN ASC'
    let condition = ''
    if (project_id) {
        condition = `WHERE a.PROJECT_ID = '${project_id}'`
    }
    if (billing_id) {
        condition = "WHERE b.BILLING_ID = " + billing_id + ""
    }
    const QUERY = query.getListBillingByTermin
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)
    const COUNT_QUERY = query.countListBillingByTermin
        .replace(/:condition/g, condition)

    const bindListProject = {
        // keyword: `%${ keyword ? keyword.toUpperCase() : keyword }%`,
        page: page,
        limit: limit
    }
    const listProject = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = listProject.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: listProject
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }
}

exports.deletePersonilDetail = async (dpersonel_id) => {
    const result = await model.d_personil_detail.destroy({ where: { dpersonel_id } })
    return await helpers.processDelete(result)
}

exports.deleteOperationalDetail = async (cost_id) => {
    const result = await model.d_cost_opr.destroy({ where: { cost_id } })
    return await helpers.processDelete(result)
}

exports.getRefStatusProject = async () => {
    const bind = {}
    const result = await db.query(query.getRefStatusProject, {
        replacements: bind,
        type: db.QueryTypes.SELECT
    })

    if (result.length > 0) {
        const rowsWithoutData = result.map(row => {
            const { DATA } = row;
            return JSON.parse(DATA);
        });
        return rowsWithoutData
    } else {
        return result
    }
}

exports.getRefStatus = async (id_tab_status) => {
    const result = await db.query(query.getRefStatus, {
        replacements: { id_tab_status },
        type: db.QueryTypes.SELECT
    })
    return result
}

exports.markAsProject = async (payload, transaction) => {
    const result = []
    const { project_id, status, id_tab_status, updated_by } = payload
    for (const id of project_id) {
        const payloadProject = { kd_status: status, project_id: id, updated_by: updated_by }
        const updateProject = await this.updateProject(payloadProject)
        if (updateProject) {
            const payloadProjectStatus = {
                project_id: id,
                kd_status: status,
                date_status: Date.now(),
                type: await helpers.getTypeByStatus(status),
                id_tab_status: id_tab_status,
                type_status: 'PR01',
                updated_by: updated_by
            }
            const createProjectStatus = await model.d_project_status.create(payloadProjectStatus, { transaction })
            result.push({ updateProject, createProjectStatus })
        }
    }
    return {
        status: true,
        message: "Data Berhasil Diupdate",
        data: result
    }
}

exports.getPortofolio = async () => {
    const result = await model.m_portofolio.findAll({ order: [['portofolio_id', 'ASC']] })
    return result
}

exports.getCustomers = async (keyword) => {
    const result = await model.m_customer.findAll({ where: { customer_name: sequelize.where(sequelize.fn('LOWER', sequelize.col('CUSTOMER_NAME')), 'LIKE', '%' + keyword.toLowerCase() + '%') } })
    return result
}

exports.getStartDate = async ({column, table}) => {
    const QUERY = query.getStartDate.replace(/:table/g, table).replace(/:column/g, column)
    const result = await db.query(QUERY, {
        replacements: {},
        type: db.QueryTypes.SELECT,
        plain: true
    })
    return result
}

exports.markAsArchive = async (payload, transaction) => {
    const result = []
    const dateNow = Date.now()
    const { project_id, archive, id_tab_status, updated_by } = payload
    for (const id of project_id) {
        const updatedProjectArchive = await model.d_project.update({ kd_archive: archive, updated_at: dateNow, updated_by: updated_by }, { where: { project_id: id }, transaction })
        const statusUpdate = await helpers.statusUpdate(updatedProjectArchive)
        if (statusUpdate) {
            const payloadProjectStatus = {
                project_id: id,
                kd_status: archive,
                date_status: dateNow,
                type: '02',
                id_tab_status: id_tab_status,
                type_status: 'PR01',
                created_by: updated_by
            }
            const createProjectStatus = await model.d_project_status.create(payloadProjectStatus, { transaction })
            result.push({ statusUpdate, createProjectStatus })
        }
    }

    return {
        status: true,
        message: "Data Berhasil Diupdate",
        data: result
    }
}

exports.markAsUnarchive = async (payload, transaction) => {
    const result = []
    const dateNow = Date.now()
    const { project_id, updated_by } = payload
    for (const id of project_id) {
        const updatedProjectArchive = await model.d_project.update({ kd_archive: null, updated_at: dateNow, updated_by: updated_by }, { where: { project_id: id }, transaction })
        const statusUpdate = await helpers.statusUpdate(updatedProjectArchive)
        if (statusUpdate) {
            const payloadProjectStatus = {
                project_id: id,
                kd_status: "104",
                date_status: dateNow,
                id_tab_status: "SA2",
                type_status: 'PR01',
                created_by: updated_by
            }
            const createProjectStatus = await model.d_project_status.create(payloadProjectStatus, { transaction })
            result.push({ statusUpdate, createProjectStatus })
        }
    }

    return {
        status: true,
        message: "Data Berhasil Diupdate",
        data: result
    }
}

exports.getDetailProjectProfile = async (project_id, NIP) => {
    const result = await db.query(query.getDetailProject, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const {
        percentage,
        cost,
        nominal,
        project_log
    } = await this.getGeneralInfo(project_id)

    return {
        ...result,
        GENERAL_INFO: { percentage, cost, nominal, project_log },
        TOP_OVERVIEW: {},
        VENDOR_OVERVIEW: {},
        BUDGET_OVERVIEW: {}
    }
}

exports.getDetailProject = async (project_id, NIP, kode) => {
    const result = await db.query(query.getDetailProject, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    if (!result) return result

    if ((NIP && kode) && result?.NIP_SALES !== NIP) {
        const roleAccess = await this.getRoleUser(kode)
        
        if ((roleAccess?.RoleName == 'ADMIN SSA' || roleAccess?.RoleName == 'ADMIN')  && roleAccess?.FlagAktif == 'T' && roleAccess?.FlagAdmin == 'T') {
            Object.assign(result, { FLAG_EDIT: true })
        } else {
            Object.assign(result, { FLAG_EDIT: false })
        }
    } else {
        Object.assign(result, { FLAG_EDIT: result.NIP_SALES == NIP ? true : false })
    }

    const {
        dataAkselerasi,
        dokumenPendukung,
        dokumenKontrak,
        dokumenBAMK,
        billingCollectionPlan,
        vendorPlanning
    } = await this.getDetailDokumen(project_id)

    if (result) {
        if (result.VENDOR_PLANNING) result.VENDOR_PLANNING = JSON.parse(result.VENDOR_PLANNING)
        else result.VENDOR_PLANNING = []
        if (result.VENDOR_FINAL) result.VENDOR_FINAL = JSON.parse(result.VENDOR_FINAL)
        else result.VENDOR_FINAL = []
    }

    return {
        ...result,
        AKSELERASI: dataAkselerasi,
        DOKUMEN_PENDUKUNG: dokumenPendukung,
        DOKUMEN_KONTRAK: dokumenKontrak,
        DOKUMEN_BAMK: dokumenBAMK,
        DOKUMEN_BILLING: billingCollectionPlan,
        DOKUMEN_VENDOR: vendorPlanning
    }
}

exports.getGeneralInfo = async (project_id) => {
    const percentage = await db.query(query.getPercentage, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
    })

    const cost = await db.query(query.getCost, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
    })

    const nominal = await db.query(query.getPeople, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    const project_log = await db.query(query.getProjectLog, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return {
        percentage,
        cost,
        nominal,
        project_log
    }
}

exports.getDetailDokumen = async (project_id) => {
    let dokumenPendukung, dokumenKontrak, dokumenBAMK
    for (let i = 1; i <= 3; i++) {
        const dataDokumen = await db.query(query.getDokumenProject, {
            replacements: { project_id, tipe_dokumen: '0' + i },
            type: db.QueryTypes.SELECT
        })

        if (i == 1) dokumenPendukung = dataDokumen
        if (i == 2) dokumenBAMK = dataDokumen
        if (i == 3) dokumenKontrak = dataDokumen
    }

    const billingCollectionPlan = await db.query(query.getBillingCollection, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
    })

    if (billingCollectionPlan.length > 0) {
        for (let i = 0; i < billingCollectionPlan.length; i++) {
            const billing = billingCollectionPlan[i];
            const billingDokumen = await this.getBillingDocument({ billing_id: billing.BILLING_ID })
            billing.TOTAL_DOKUMEN = billingDokumen.DOKUMEN_PENDUKUNG.length
            billing.DOKUMEN = billingDokumen.DOKUMEN_PENDUKUNG
        }
    }

    const vendorPlanning = await db.query(query.getVendorPlanning, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
    })

    const dataAkselerasi = await db.query(query.getDataEkselerasi, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return {
        dataAkselerasi,
        dokumenPendukung,
        dokumenKontrak,
        dokumenBAMK,
        billingCollectionPlan,
        vendorPlanning
    }
}

exports.insertDokumen = async (payloadData, files, transaction) => {
    console.log("an.. insertDataDokumen")
    const uploadDocument = await this.processUploadFile(payloadData, files);
    const saveDokumen = await this.saveDokumen(payloadData, uploadDocument)
    const saveBillingDokumen = await this.saveBillingDokumen(payloadData, saveDokumen)

    return {
        dokumen_id: saveDokumen,
        dokumen_billing: saveBillingDokumen,
        keterangan: "Dokumen berhasil disimpan",
    }
}

exports.processUploadFile = async (data, files) => {
    const result = []
    for (const lampiran of files) {
        const name = lampiran.name
        const ext = path.extname(name).toLowerCase()
        const file_name = Date.now() + '_' + ext
        const _date = moment().local('id');
        const _months = Number(_date.format("MM"));

        const path_upload = "files" + '/' + `${_date.year()}/${_months}/${_date.date()}/`;

        const full_path = await this.uploadFile(lampiran, path_upload, file_name)
        result.push(full_path)
    }
    return result
}

exports.uploadFile = async (lampiran, path_upload, file_name) => {
    //concat dir and name upload
    let full_path = path_upload + file_name;

    // Check Directory
    if (!fs.existsSync(path_upload)) {
        // Move file upload
        await fs.promises.mkdir(path_upload, { recursive: true }, (err) => {
            if (err) console.error(err);
        });

        // Give privilege path folder
        // fs.chmod(path_upload, 0o777, (err) => {
        // 	if (err) console.log(err);
        // });

        //do upload file
        lampiran.mv(full_path, (err) => {
            if (err) console.error(err);
        });
    } else {
        //check file in path exist or not
        if (!fs.existsSync(full_path)) {
            // Give privilege folder
            // chmodr(path_upload, 0o777, (err) => {
            // 	if (err) console.log(err);
            // });

            // Do upload file
            lampiran.mv(full_path, (err) => {
                if (err) console.error(err);
            });
        } else {
            // if path exist than access file
            fs.access(full_path, fs.F_OK, (err) => {
                if (err) {
                    return err
                }

                //give privilege to remove file
                // chmodr(full_path, 0o777, (err) => {
                // 	if (err) { console.log(err) }
                // });

                // Do remove file
                fs.unlink(full_path, (err) => {
                    if (err) { console.error(err) }
                });

                //give privilege to folder
                // chmodr(path_upload, 0o777, (err) => {
                // 	if (err) { console.log(err) }
                // });

                // Do upload file again
                lampiran.mv(full_path, (err) => {
                    if (err) console.error(err);
                });
            });
        }
    }

    return full_path;
}

exports.saveDokumen = async (payloadData, full_path) => {
    const post_data = []
    for (let i = 0; i < payloadData.length; i++) {
        const data = payloadData[i]
        const payload = {
            ...data,
            dokumen_id: uuidv4(),
            url_dokumen: full_path[i]
        }
        const result = await model.d_dokumen.create(payload)
        post_data.push(result)
    }
    return post_data
}

exports.saveBillingDokumen = async (payloadData, saveDokumen) => {
    const result = []

    for (let i = 0; i < payloadData.length; i++) {
        const data = payloadData[i];

        const { billing_id, created_by } = data
        if (billing_id) {
            const payload = {
                billing_id: billing_id,
                dokumen_id: saveDokumen[i].dataValues.dokumen_id,
                billing_detail_id: uuidv4(),
                created_by: created_by
            }

            const created = await model.d_billing_dokumen.create(payload)
            result.push(created)
        }
    }
    return result


}

exports.deleteDokumen = async (dokumen_id) => {
    const dataDokumen = await model.d_dokumen.findOne({ where: { dokumen_id }, raw: true })
    if (dataDokumen) await this.deleteFileFromDirectory(dataDokumen.url_dokumen)
    const result = await model.d_dokumen.destroy({ where: { dokumen_id } })
    const resultBillingDokumen = await model.d_billing_dokumen.destroy({ where: { dokumen_id } })
    return await helpers.processDelete(result)
}

exports.deleteFileFromDirectory = async (path) => {
    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            return err
        } else {
            //give privilege to remove file
            chmodr(path, 0o777, (err) => {
                if (err) {
                    return err;
                }
            });
            // do remove file
            fs.unlink(path, (err) => {
                if (err) {
                    return err;
                }
            });
        }
    });
}

exports.updateProject = async (payload) => {
    const { project_id } = payload
    Object.assign(payload, { updated_at: Date.now() })

    const result = await model.d_project.update(payload, { where: { project_id } })
    return await helpers.processUpdate(result)
}

exports.updateCustomer = async (payload) => {
    const { customer_id } = payload
    Object.assign(payload, { updated_at: Date.now() })

    const result = await model.m_customer.update(payload, { where: { customer_id } })
    return await helpers.processUpdate(result)
}

exports.updateKdStatus = async (payload) => {
    const { billing_id } = payload
    Object.assign(payload, { updated_at: Date.now() })
    const result = await model.d_billing.update(payload, { where: { billing_id } })
    return await helpers.processUpdate(result)
}

exports.updateHLog = async (payload) => {
    const { id_log } = payload
    Object.assign(payload, { updated_at: Date.now() })

    const result = await model.h_log.update(payload, { where: { id_log } })
    return await helpers.processUpdate(result)
}

exports.saveDokumenBAMK = async (Documents, payloadData) => {
    const result = []
    for (let i = 0; i < Documents.length; i++) {
        const { dokumen_id } = Documents[i];
        const payloadDokumen = { dokumen_bamk_id: dokumen_id, project_id: payloadData[i] }
        const updatedProject = await this.updateProject(payloadDokumen)
        result.push(updatedProject)
    }

    return result
}

exports.postBillingCollection = async (payload) => {
    let result
    const { billing_id } = payload

    if (!billing_id) {
        const est_periode_billing = payload.est_periode_billing.split("-")
        Object.assign(payload, { billing_id: uuidv4(), est_periode_billing: est_periode_billing[0], est_bulan_billing: est_periode_billing[1] })
        result = await model.d_billing.create(payload)
    } else {
        if (payload?.real_periode_billing && payload?.real_periode_billing !== 'null-null') {
            const real_periode_billing = payload.real_periode_billing.split("-")
            Object.assign(payload, { real_periode_billing: real_periode_billing[0], real_bulan_billing: real_periode_billing[1] })
        }
        const {
            billingCollectionPlan
        } = await this.getDetailDokumen(payload?.project_id)

        const detailProject = await this.getDetailProject(payload?.project_id)


        let total_real_billing = (billingCollectionPlan.reduce((total, item) => total + item.REAL_BILLING, 0)) + parseInt(payload?.real_billing);

        if (detailProject?.NILAI_KONTRAK === null || detailProject?.NILAI_KONTRAK === 0) {
            return {
                status: false,
                message: "Nilai Kontrak Masih Nol",
            }
        } else if (total_real_billing > detailProject?.NILAI_KONTRAK) {
            return {
                status: false,
                message: "Total Realisasi Billing Tidak Boleh Melebihi Nilai Kontrak",
            }
        } else {
            await model.d_billing.update(payload, { where: { billing_id: billing_id } })
                .then(async (res) => {
                    result = await helpers.processUpdate(res)
                })
                .catch(error => console.log(error, "ERROR <<<<<<"))
            return result
        }
    }
}

exports.getBillingCollection = async (project_id) => {
    const result = await db.query(query.getBillingCollection, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.deleteBillingCollection = async (billing_id) => {
    const result = await model.d_billing.destroy({ where: { billing_id } })
    return await helpers.processDelete(result)
}

exports.deleteBillingDokumen = async (billing_detail_id) => {
    const result = await model.d_billing_dokumen.destroy({ where: { billing_detail_id } })
    return await helpers.processDelete(result)
}

exports.postVendorPlanning = async (payload) => {
    const { project_vendor_id } = payload
    let result = null
    if (project_vendor_id) {
        await model.d_project_vendor.update(payload, { where: { project_vendor_id: project_vendor_id } })
            .then(async (res) =>
                result = await helpers.processUpdate(res)
            ).catch(err => console.log(err))
    } else {
        Object.assign(payload, { project_vendor_id: uuidv4() })
        result = await model.d_project_vendor.create(payload)
    }
    return result
}

exports.getVendorPlanning = async (project_id) => {
    const result = await db.query(query.getVendorPlanning, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.deleteVendorPlanning = async (project_vendor_id) => {
    const result = await model.d_project_vendor.destroy({ where: { project_vendor_id } })
    return await helpers.processDelete(result)
}

exports.postCBBPlanning = async (payload) => {
    Object.assign(payload, { cbb_id: uuidv4() })
    const result = await model.d_project_cbb.create(payload)
    return result
}

exports.costPersonilPlanning = async (payload) => {
    Object.assign(payload, { personel_id: uuidv4() })
    const result = await model.d_personil.create(payload)
    return result
}

exports.getDokumenPendukung = async (project_id) => {
    const result = await db.query(query.getDokumenPendukung, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getDokumenKontrak = async (project_id) => {
    const result = await db.query(query.getDokumenKontrak, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getDokumenBAMK = async (project_id) => {
    const result = await db.query(query.getDokumenBAMK, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getCBBPlanning = async (project_id) => {
    let total_direct_cost = 0, total_indirect_cost = 0
    const result = await db.query(query.getCBBPlanning, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    const lampiran = await db.query(query.getDokumenProject, {
        replacements: { project_id, tipe_dokumen: "04" },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    if (result.length > 0) {
        for (const { DIRECT_COST, INDIRECT_COST } of result) {
            total_direct_cost += DIRECT_COST
            total_indirect_cost += INDIRECT_COST
        }
    }

    return {
        lampiran: lampiran,
        cbb_data: result,
        total_direct_cost: total_direct_cost,
        total_indirect_cost: total_indirect_cost
    }
}

exports.deleteCBBPlanning = async (cbb_id) => {
    const result = await model.d_project_cbb.destroy({ where: { cbb_id } })

    return await helpers.processDelete(result)
}

exports.getCostPersonilPlanning = async (project_id) => {
    let total_cost = 0
    const dataProject = await model.d_project.findOne({ where: { project_id }, raw: true })
    const result = await db.query(query.getCostPersonilPlanning, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT
    })

    if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            const personil = result[i];
            total_cost += personil.COST_TOTAL
            const personelDetail = await model.d_personil_detail.findOne({ where: { personel_id: personil.PERSONEL_ID } })
            Object.assign(personil, { PERSONEL_DETAIL: personelDetail })
        }
    }

    return {
        PROJECT_ID: project_id,
        PROJECT_NAME: dataProject?.project_name,
        PERSONEL: result,
        TOTAL_COST: total_cost
    }
}

exports.deleteCostPersonilPlanning = async (personel_id) => {
    const result = await model.d_personil.destroy({ where: { personel_id } })
    return await helpers.processDelete(result)
}

exports.deleteContactCustomer = async (customer_contact_id) => {
    const result = await model.m_customer_contact.destroy({ where: { customer_contact_id } })
    return await helpers.processDelete(result)
}

exports.getSubReferensiByJenis = async ({ jns_ref, kd_ref, keyword }) => {
    const result = await db.query(query.getSubReferensiByJenis, {
        replacements: { jns_ref, kd_ref, keyword: `%${keyword}%` },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getListVendor = async (keyword) => {
    const result = keyword ? await model.m_vendor_pt.findAll({ where: { nama_perusahaan: sequelize.where(sequelize.fn('LOWER', sequelize.col('NAMA_PERUSAHAAN')), 'LIKE', '%' + keyword.toLowerCase() + '%') } }) : await model.m_vendor_pt.findAll()

    return result
}

exports.validasiPayloadMarkAsActualID = async (payload) => {
    const { project_actual_id, project_id, new_project } = payload
    const dataProject = await model.d_project.findOne({ where: { project_id: project_actual_id, project_type_id: '1' }, raw: true })

    if (!dataProject && Object.keys(new_project).length === 0 && new_project.constructor === Object) return {
        valid: false,
        message: "Project yang anda masukkan tidak valid!"
    }

    const validasiProjectAkselerasi = await this.validasiProjectAkselerasi(payload, '2')

    return {
        valid: validasiProjectAkselerasi.valid,
        message: "Project yang anda masukkan tidak valid!"
    }
}

exports.validasiProjectAkselerasi = async (payload, type) => {
    const { project_id } = payload
    let valid = true
    for (const project of project_id) {
        const dataProject = await model.d_project.findOne({ where: { project_id: project, project_type_id: type }, raw: true })
        if (!dataProject) {
            valid = false
            break
        }
    }

    return {
        valid: valid,
        message: "Project yang anda masukkan tidak valid!"
    }
}

exports.markAsActualID = async (payload, transaction) => {
    const { project_actual_id, new_project, updated_by } = payload
    if (project_actual_id.length == 0) {
        const project_id = uuidv4()
        Object.assign(new_project, {
            project_id: project_id,
            created_by: updated_by
            // project_no: await this.generateNoProject(project_id),
        })
        const createProject = await this.createDProject(new_project, transaction)
        payload.project_actual_id = project_id
        const postMarkAsActualID = await this.postMarkAsActualID(payload, transaction)
        return {
            project: createProject,
            markAsActualId: postMarkAsActualID
        }
    } else {
        const postMarkAsActualID = await this.postMarkAsActualID(payload, transaction)
        return {
            markAsActualId: postMarkAsActualID
        }
    }
}

exports.postMarkAsActualID = async (payload, transaction) => {
    const result = []
    const { project_actual_id, project_id, updated_by } = payload
    for (const id of project_id) {
        const updatedProject = await model.d_project.update({ project_actual_id: project_actual_id, updated_by: updated_by }, { where: { project_id: id }, transaction })
        result.push(await helpers.processUpdate(updatedProject))
    }

    return result
}

exports.getListProjectVendor = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    const order_by = 'ORDER BY a.CREATED_AT ' + order
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `AND TRUNC(a.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD')`
    }

    const QUERY = query.getListProjectVendor
        .replace(/:condition/g, condition)
        .replace(/:order/g, order_by)

    const bindListProject = {
        keyword: `%${keyword ? keyword.toUpperCase() : keyword}%`,
        page: page,
        limit: limit
    }

    const result = await db.query(QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT
    })

    const COUNT_QUERY = query.countListProjectVendor

    const countData = await db.query(COUNT_QUERY, {
        replacements: bindListProject,
        type: db.QueryTypes.SELECT,
        plain: true
    })

    if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (item.DETAIL_VENDOR) item.DETAIL_VENDOR = JSON.parse(item.DETAIL_VENDOR)
        }
    }

    const statusData = result.length > 0 ? true : false

    return {
        status: statusData,
        data: statusData ?
            {
                total_data: countData.total_data,
                total_halaman: countData.total_halaman,
                limit: countData.limit,
                list_data: result
            } : {
                total_data: 0,
                total_halaman: null,
                limit: null,
                list_data: []
            }
    }

    return result
}

exports.getDetailProjectVendor = async (project_id) => {
    const result = await db.query(query.getDetailProjectVendor, {
        replacements: { project_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    if (result) {
        if (result.VENDOR_PLANNING) result.VENDOR_PLANNING = JSON.parse(result.VENDOR_PLANNING)
        else result.VENDOR_PLANNING = []
        if (result.VENDOR_FINAL) result.VENDOR_FINAL = JSON.parse(result.VENDOR_FINAL)
        else result.VENDOR_FINAL = []
    }

    return result
}

exports.getProjectByType = async (type, keyword) => {
    const result = await db.query(query.getProjectByType, {
        replacements: { type, keyword: `%${keyword}%` },
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.markAsAcceleration = async (payload, transaction) => {
    const result = []
    const { project_id, updated_by } = payload
    for (const id of project_id) {
        const updatedProject = await model.d_project.update({ project_type_id: '2', updated_by: updated_by }, { where: { project_id: id }, transaction })
        result.push(await helpers.processUpdate(updatedProject))
    }

    return result
}

exports.insertProjectStatus = async (payload, transaction) => {
    const { id_tab_status, project_id, kd_status, billing_id } = payload
    const result = model.d_project_status.create(payload, { transaction })
    if ((id_tab_status == "FN1" || id_tab_status == "DL1") && billing_id) {
        const updateDBilling = await model.d_billing.update({ kd_status: kd_status }, { where: { billing_id: billing_id }, transaction })
        console.log(updateDBilling, "UPDATE DBILLING <<<<")
    }
    return result
}

exports.getDetailVendorRealization = async ({ project_vendor_id }) => {
    const result = await db.query(query.getDetailVendorRealization, {
        replacements: { project_vendor_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const {
        dataAkselerasi,
        dokumenPendukung,
        dokumenKontrak,
        dokumenBAMK,
        billingCollectionPlan,
        vendorPlanning
    } = await this.getDetailDokumen(project_vendor_id)

    return {
        ...result,
        DOKUMEN_PENDUKUNG: dokumenPendukung,
        DOKUMEN_KONTRAK: dokumenKontrak,
        DOKUMEN_BAMK: dokumenBAMK,
        DOKUMEN_BILLING: billingCollectionPlan,
        DOKUMEN_VENDOR: vendorPlanning
    }


}

exports.dataRevenueStream = async (payload, transaction) => {
    Object.assign(payload, { billing_revenue_id: uuidv4() })
    const result = await model.d_billing_revenue.create(payload, { transaction })
    return result
}

exports.dataRevenueStreamUpdate = async (payload, transaction) => {
    const { billing_revenue_id } = payload
    Object.assign(payload, { updated_date: Date.now() })
    const result = await model.d_billing_revenue.update(payload, { where: { billing_revenue_id } })
    return await helpers.processUpdate(result)
}

exports.getBillingRealization = async ({ }) => {
    const result = await db.query(query.getBillingRealization, {
        replacements: {},
        type: db.QueryTypes.SELECT
    })

    return result
}

exports.getBillingDocument = async ({ billing_id }) => {
    const result1 = await db.query(query.getBillingDocument, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT
    })

    const result2 = await db.query(query.getBillingDocumentKeuangan, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT
    })

    return {
        DOKUMEN_PENDUKUNG: result1,
        DOKUMEN_KEUANGAN: result2,
    }
}

exports.getListBillingRevenue = async ({ keyword, page, limit, order = 'DESC', startDate, endDate }) => {
    if (startDate === undefined) startDate = ''
    if (endDate === undefined) endDate = ''
    let condition = ''
    if (startDate !== '' && endDate !== '') {
        condition += `WHERE TRUNC(abc.CREATED_AT) BETWEEN TO_DATE('${startDate}', 'YYYY-MM-DD') AND TO_DATE('${endDate}', 'YYYY-MM-DD') `
        if (keyword) {
            condition += ` AND (upper(abc.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(abc.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(abc.PORTOFOLIO) like upper('%${keyword}%') 
                        OR upper(abc.TERMIN) like upper('%${keyword}%') 
                        OR upper(abc.CUSTOMER_NAME) like upper('%${keyword}%')) `
        }
    } else {
        if (keyword) {
            condition += `WHERE (upper(abc.PROJECT_NO) like upper('%${keyword}%')
                        OR upper(abc.PROJECT_NAME) like upper('%${keyword}%')
                        OR upper(abc.PORTOFOLIO) like upper('%${keyword}%') 
                        OR upper(abc.TERMIN) like upper('%${keyword}%') 
                        OR upper(abc.CUSTOMER_NAME) like upper('%${keyword}%')) `
        }
    }
    const QUERY1 = query.getListBillingRevenue1.replace(/:order/g, order).replace(/:condition/g, condition)
    
    const result1 = await db.query(QUERY1, {
        replacements: {
            page: page,
            limit: limit
        },
        type: db.QueryTypes.SELECT
    })
    const QUERY2 = query.getListBillingRevenue2.replace(/:order/g, order).replace(/:condition/g, condition)
    const result2 = await db.query(QUERY2, {
        replacements: {
            page: page,
            limit: limit
        },
        type: db.QueryTypes.SELECT
    })

    const resultCount = await db.query(query.countListBillingRevenue, {
        replacements: { page, limit },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    let result = order === 'DESC' ? result1 : result2

    const statusData = result.length > 0 ? true : false

    return statusData ?
        {
            total_data: resultCount.total_data,
            total_halaman: resultCount.total_halaman,
            limit: resultCount.limit,
            list_data: result
        } : {
            total_data: 0,
            total_halaman: null,
            limit: null,
            list_data: []
        }
}

exports.getDetailBillingRevenue = async ({ billing_id }) => {
    const result = await db.query(query.getDetailBillingRevenue, {
        replacements: { billing_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const {
        dataAkselerasi,
        dokumenPendukung,
        dokumenKontrak,
        dokumenBAMK,
        billingCollectionPlan,
        vendorPlanning
    } = await this.getDetailDokumen(result.PROJECT_ID)

    return {
        ...result,
        AKSELERASI: dataAkselerasi,
        DOKUMEN_PENDUKUNG: dokumenPendukung,
        DOKUMEN_KONTRAK: dokumenKontrak,
        DOKUMEN_BAMK: dokumenBAMK,
        DOKUMEN_BILLING: billingCollectionPlan,
        DOKUMEN_VENDOR: vendorPlanning
    }
}

exports.getDetailCustomer = async ({ customer_id }) => {
    const result = await db.query(query.getDetailCustomer, {
        replacements: { customer_id },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const contact = await db.query(query.getDetailContactCustomer, {
        replacements: { customer_id },
        type: db.QueryTypes.SELECT
    })

    return {
        ...result,
        CONTACT_CUSTOMER: contact,
    }
}

exports.getListСustomer = async ({ keyword, page, limit, order = 'DESC' }) => {
    const QUERY = query.getListCustomer.replace(/:order/g, order)
    const result = await db.query(QUERY, {
        replacements: {
            keyword: `%${keyword ? keyword.toUpperCase() : keyword}%`,
            page: page,
            limit: limit
        },
        type: db.QueryTypes.SELECT
    })

    const resultCount = await db.query(query.countListCustomer, {
        replacements: { page, limit },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = result.length > 0 ? true : false

    return statusData ?
        {
            total_data: resultCount.total_data,
            total_halaman: resultCount.total_halaman,
            limit: resultCount.limit,
            list_data: result
        } : {
            total_data: 0,
            total_halaman: null,
            limit: null,
            list_data: []
        }
}

exports.getListReferensi = async ({ keyword, page, limit, order = 'DESC' }) => {
    const QUERY = query.getListReferensi.replace(/:order/g, order)
    const result = await db.query(QUERY, {
        replacements: {
            keyword: `%${keyword ? keyword.toUpperCase() : keyword}%`,
            page: page,
            limit: limit
        },
        type: db.QueryTypes.SELECT
    })

    const resultCount = await db.query(query.countListReferensi, {
        replacements: { page, limit },
        type: db.QueryTypes.SELECT,
        plain: true
    })

    const statusData = result.length > 0 ? true : false

    return statusData ?
        {
            total_data: resultCount.total_data,
            total_halaman: resultCount.total_halaman,
            limit: resultCount.limit,
            list_data: result
        } : {
            total_data: 0,
            total_halaman: null,
            limit: null,
            list_data: []
        }
}