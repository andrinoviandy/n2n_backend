exports.login = async (req, res, next) => {
    /* 
        #swagger.tags = ['Users'] 
    */
    next()
}

exports.getListMenu = async (req, res, next) => {
    /* 
        #swagger.tags = ['Index'] 
        #swagger.responses[200] = {
            description: 'Get List Menu',
            schema: { $ref: '#/getListMenu' }
        }
    */
    next()
}

exports.getAcl = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['id_acl'] = { type: 'string' }
    */
    next()
}

exports.getReferensiByJenis = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { jns_ref, keyword } = req.query
    next()
}

exports.getPermissionCrud = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['jns_ref'] = { type: 'string' }
    */
    next()
}

exports.insertNewProject = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new project',
            schema: {
                project_kategori_id: '',
                project_type_id: '',  
                project_no: '',  
                project_name: '',  
                portofolio_id: '',  
                category_id: '', 
                est_nilai_penawaran: '',  
                est_cogs: '', 
                customer_id: '', 
                kd_area: '',  
                kd_status: '',
            }
        }
    */
    const {
        project_kategori_id,
        project_type_id,
        project_no,
        project_name,
        portofolio_id,
        category_id,
        est_nilai_penawaran,
        est_cogs,
        customer_id,
        kd_area,
        kd_status,
    } = req.body
    next()
}
exports.insertCustomer = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new customer',
            schema: {
                kode_akun: '204',
                customer_name: '',
                npwp: '',
                address: '',
                email: '',
                fax: '',
                telp: '',
                description: ''
            }
        }
    */
    const {
        kode_akun,
        customer_name,
        npwp,
        address,
        email,
        fax,
        telp,
        description
    } = req.body
    next()
}

exports.insertContactCustomer = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a contact customer',
            schema: {
                customer_id: '',
                nama_contact: '',
                address: '',
                email: '',
                phone: '',
                jabatan: '',
                gender: '',
                birthdate: '',
                membawahi: '',
                description: ''
            }
        }
    */
    const {
        customer_id,
        nama_contact,
        address,
        email,
        phone,
        jabatan,
        gender,
        birthdate,
        membawahi,
        description
    } = req.body
    next()
}

exports.insertReferensi = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new referensi',
            schema: {
                kd_ref: '',
                ur_ref: '',
                jns_ref: '',
                sub_kd_ref: '',
                sub_jns_ref: '',
                start_date: '',
                end_date: ''
            }
        }
    */
    const {
        kd_ref,
        ur_ref,
        jns_ref,
        sub_kd_ref,
        sub_jns_ref,
        start_date,
        end_date
    } = req.body
    next()
}

exports.insertPersonilDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a detail personil',
            schema: {
                sub_dpersonel_id: '',
                personel_id: '',
                user_id: '',
                nik: '',
                nama_personil: '',
                divisi_id: '',
                qty_date: '',
                satuan_date: '',
                flag_personil: ''
            }
        }
    */
    const {
        sub_dpersonel_id,
        personel_id,
        user_id,
        nik,
        nama_personil,
        divisi_id,
        qty_date,
        satuan_date,
        flag_personil
    } = req.body
    next()
}

exports.insertOperationalDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a cost operational',
            schema: {
                project_id: '',
                kategori_cost: '',
                mata_anggaran: '',
                divisi_id: '',
                jenis_cost: '',
                nilai_cost: '',
                tanggal_cost: '',
                no_pr: '',
                no_nodin: '',
                status: ''
            }
        }
    */
    const {
        project_id,
        kategori_cost,
        mata_anggaran,
        divisi_id,
        jenis_cost,
        nilai_cost,
        tanggal_cost,
        no_pr,
        no_nodin,
        status
    } = req.body
    next()
}

exports.insertOperationalDetailDokumen = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a dokumen cost operational',
            schema: {
                cost_id: '',
                dokumen_id: ''
            }
        }
    */
    const {
        cost_id,
        dokumen_id
    } = req.body
    next()
}

exports.insertBillingDokumen = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new project',
            schema: {
                billing_id: '',
                dokumen_id: ''
            }
        }
    */
    const {
        billing_id,
        dokumen_id
    } = req.body
    next()
}

exports.getListProject = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getListProjectForCostPersonil = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getDetailCostPersonil = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { project_id } = req.query
    next()
}

exports.getDetailCostAdvance = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { cost_revenue_id } = req.query
    next()
}

exports.getDetailTagihanVendor = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { billing_revenue_id } = req.query
    next()
}

exports.getDetailCostPersonilDetail = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { personel_id } = req.query
    next()
}

exports.getDetailCostOperasional = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { project_id } = req.query
    next()
}

exports.getDetailVendorProjectBilling = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { billing_id } = req.query
    next()
}

exports.getDetailCostOperasionalWithDokumenByCostId = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { cost_id } = req.query
    next()
}

exports.getListProjectForCostOperasional = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getListProjectForVendorProjectBilling = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getListProjectForTagihanVendor = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getListProjectForCostAdvanced = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, startDate, endDate } = req.query
    next()
}

exports.getListBillingByTermin = (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { status, keyword, page, limit, project_id, billing_id } = req.query
    next()
}

exports.getRefStatusProject = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getRefStatus = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}


exports.markAsProject = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',                                             
            required: true,  
            schema: {
                $project_id: [],
                $status: ''
            }                   
        }
    */
    next()
}

exports.getPortofolio = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getCustomers = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { keyword } = req.query
    next()
}

exports.getStartDate = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { keyword } = req.query
    next()
}

exports.markAsArchive = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',                                             
            required: true,  
            schema: {
                $project_id: [],
                $archive: ''
            }                   
        }
    */
    next()
}

exports.markAsUnarchive = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',                                             
            required: true,  
            schema: {
                $project_id: []
            }                   
        }
    */
    next()
}

exports.getDetailProject = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['project_id'] = { type: 'string' }
        #swagger.parameters['kode'] = { type: 'string' }
    */
    const {
        project_id,
        kode
    } = req.body
    next()
}

exports.getDetailProjectProfile = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['project_id'] = { type: 'string' }
    */
    const {
        project_id
    } = req.body
    next()
}

exports.uploadDokumen = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',                                             
            required: true,  
            schema: {
                $project_id: []
            }                   
        }
    */
    next()
}

exports.deleteDokumen = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['dokumen_id'] = { type: 'string' }
    */
    next()
}

exports.deletePersonilDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['dpersonel_id'] = { type: 'string' }
    */
    next()
}

exports.deleteContactCustomer = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['customer_contact_id'] = { type: 'string' }
    */
    next()
}

exports.deleteOperationalDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['cost_id'] = { type: 'string' }
    */
    next()
}

exports.updateProject = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new project',
            schema: {
                project_id: '',
                project_kategori_id: '',
                project_type_id: '',  
                project_no: '',  
                project_name: '',  
                portofolio_id: '',  
                category_id: '', 
                est_nilai_penawaran: '',  
                est_cogs: '', 
                customer_id: '', 
                kd_area: '',  
                kd_status: '',
            }
        }
    */
    const {
        project_id,
        project_kategori_id,
        project_type_id,
        project_no,
        project_name,
        portofolio_id,
        category_id,
        est_nilai_penawaran,
        est_cogs,
        customer_id,
        kd_area,
        kd_status,
    } = req.body
    next()
}

exports.updateCustomer = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new customer',
            schema: {
                kode_akun: '204',
                customer_name: '',
                npwp: '',
                address: '',
                email: '',
                fax: '',
                telp: '',
                description: ''
            }
        }
    */
    const {
        kode_akun,
        customer_name,
        npwp,
        address,
        email,
        fax,
        telp,
        description
    } = req.body
    next()
}

exports.uploadDokumenBAMK = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',                                             
            required: true,  
            schema: {
                $project_id: []
            }                   
        }
    */
    next()
}

exports.deleteDokumenBAMK = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['dokumen_id'] = { type: 'string' }
    */
    next()
}

exports.billingCollection = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new Billing Collection',
            schema: {
                project_id: '',
                termin: '',  
                divisi_id: '',    
                portofolio_id: '',  
                est_periode_billing: '',
                est_bulan_billing: '', 
                est_billing: '',  
                real_periode_billing: '', 
                real_bulan_billing: '', 
                real_billing: '',  
                kd_status: '',
                kategori_billing: '',
                created_by: ''
            }
        }
    */
    next()
}

exports.vendorPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new Vendor Planning',
            schema: {
                project_id: '',
                vendor_id: '',  
                nilai_kontrak: '',    
                no_kontrak: '',  
                judul_kontrak: '',
                flag_final: '', 
                created_by: ''
            }
        }
    */
    next()
}

exports.CBBPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new CBB Planning',
            schema: {
                project_id: '',  
                divisi_id: '',    
                coa_id: '',  
                direct_cost: '',
                indirect_cost: '', 
            }
        }
    */
    next()
}

exports.deleteBillingCollection = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['billing_id'] = { type: 'string' }
    */
    next()
}

exports.deleteBillingDokumen = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['billing_id'] = { type: 'string' }
    */
    next()
}

exports.deleteVendorPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['project_vendor_id'] = { type: 'string' }
    */
    next()
}

exports.costPersonilPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new Cost Personil Planning',
            schema: {
                project_id: '',  
                role_id: '',    
                kualifikasi_id: '',  
                qty_person: '',
                satuan_person: '', 
                qty_date: '',
                satuan_date: '',
                cost_unit: '',
                cost_total: ''
            }
        }
    */
    next()
}

exports.getCBBPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getCostPersonilPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getBillingCollection = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getVendorPlanning = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getSubReferensiByJenis = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { jns_ref, kd_ref, keyword } = req.query
    next()
}

exports.getListVendor = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    const { keyword } = req.query
    next()
}

exports.markAsActualID = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Mark As Actual Id',
            schema: {
                project_actual_id: '',  
                project_id: []
            }
        }
    */
    next()
}

exports.getListProjectVendor = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getDetailProjectVendor = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['project_id'] = { type: 'string' }
    */
    next()
}

exports.getProjectByType = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['type'] = { type: 'string' }
        #swagger.parameters['keyword'] = { type: 'string' }
    */
    next()
}

exports.markAsAcceleration = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Mark As Acceleration',
            schema: { 
                project_id: []
            }
        }
    */
    next()
}

exports.insertProjectStatus = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new project',
            schema: {
                project_id: '',
                id_tab_status: '',  
                kd_status: '',
                billing_id: ''
            }
        }
    */

    next()
}

exports.getDetailVendorRealization = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['project_vendor_id'] = { type: 'string' }
    */
    next()
}

exports.dataRevenueStream = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a new billing revenue',
            schema: {
                billing_id: '',
                status_pymad: '',  
                nominal_pymad: '',
                tanggal_bast: '',
                no_invoice: '',
                tanggal_invoice: '',
                status_invoice: '',
                nominal_invoice: '',
                no_faktur: '',
                tanggal_faktur: '',
                status_pelunasan: '',
                nominal_pelunasan: '',
                tanggal_pelunasan: '',
                denda_pajak: '',
                pph: '',
                ppn: '',
                ppn_tarif: '',
                wapu: '',
                biaya_lain: '',
                outstanding: '',
                nominal_dpp: '',
            }
        }
    */

    next()
}

exports.getBillingRealization = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
    */
    next()
}

exports.getBillingDocument = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['billing_id'] = { type: 'string' }
    */
    next()
}

exports.getListBillingRevenue = async (req, res, next) => {
    /*
       #swagger.tags = ['Index']
   */
    next()
}

exports.getListCustomer = async (req, res, next) => {
    /*
       #swagger.tags = ['Index']
   */
    next()
}

exports.getListReferensi = async (req, res, next) => {
    /*
       #swagger.tags = ['Index']
   */
    next()
}

exports.getDetailBillingRevenue = async (req, res, next) => {
    /*
       #swagger.tags = ['Index']
       #swagger.parameters['billing_id'] = { type: 'string' }
   */
    next()
}

exports.getDetailCustomer = async (req, res, next) => {
    /*
       #swagger.tags = ['Index']
       #swagger.parameters['customer_id'] = { type: 'string' }
   */
    next()
}

exports.updateKdStatus = async (req, res, next) => {
    /*
        #swagger.tags = ['Index']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update Kode Status',
            schema: {
                billing_id: '',
                kd_status: ''
            }
        }
    */
    const {
        billing_id,
        kd_status
    } = req.body
    next()
}