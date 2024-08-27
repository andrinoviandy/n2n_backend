const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../database/database');

exports.D_BILLING = db.define('D_BILLING',
    {
		billing_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "BILLING_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        termin: {
            type : DataTypes.STRING,
            field: 'TERMIN'
        },
        divisi_id: {
            type : DataTypes.STRING,
            field: 'DIVISI_ID'
        },
        portofolio_id: {
            type : DataTypes.STRING,
            field: 'PORTFOLIO_ID'
        },
        est_periode_billing: {
            type : DataTypes.STRING,
            field: 'EST_PERIODE_BILLING'
        },
        est_bulan_billing: {
            type : DataTypes.STRING,
            field: 'EST_BULAN_BILLING'
        },
        est_billing: {
            type : DataTypes.NUMBER,
            field: 'EST_BILLING'
        },
        real_periode_billing: {
            type : DataTypes.STRING,
            field: 'REAL_PERIODE_BILLING'
        },
        real_bulan_billing: {
            type : DataTypes.STRING,
            field: 'REAL_BULAN_BILLING'
        },
        real_billing: {
            type : DataTypes.NUMBER,
            field: 'REAL_BILLING'
        },
        kd_status: {
            type : DataTypes.STRING,
            field: 'KD_STATUS'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        kategori_billing: {
            type : DataTypes.STRING,
            field: 'KATEGORI_BILLING'
        },
        desc_termin: {
            type : DataTypes.STRING,
            field: 'DESC_TERMIN'
        },
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_BILLING_DOKUMEN = db.define('D_BILLING_DOKUMEN',
    {
		billing_detail_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "BILLING_DETAIL_ID"
        },
        billing_id: {
            type : DataTypes.STRING,
            field: 'BILLING_ID'
        },
        dokumen_id: {
            type : DataTypes.STRING,
            field: 'DOKUMEN_ID'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_BILLING_REVENUE = db.define('D_BILLING_REVENUE',
    {
        billing_revenue_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "BILLING_REVENUE_ID"
        },
        billing_id: {
            type : DataTypes.STRING,
            field: 'BILLING_ID'
        },
        status_pymad: {
            type : DataTypes.STRING,
            field: 'STATUS_PYMAD'
        },
        nominal_pymad: {
            type : DataTypes.NUMBER,
            field: 'NOMINAL_PYMAD'
        },
        tanggal_bast: {
            type : DataTypes.DATE,
            field: 'TANGGAL_BAST'
        },
        no_invoice: {
            type : DataTypes.STRING,
            field: 'NO_INVOICE'
        },
        tanggal_invoice: {
            type : DataTypes.DATE,
            field: 'TANGGAL_INVOICE'
        },
        status_invoice: {
            type : DataTypes.STRING,
            field: 'STATUS_INVOICE'
        },
        nominal_invoice: {
            type : DataTypes.NUMBER,
            field: 'NOMINAL_INVOICE'
        },
        no_faktur: {
            type : DataTypes.STRING,
            field: 'NO_FAKTUR'
        },
        tanggal_faktur: {
            type : DataTypes.DATE,
            field: 'TANGGAL_FAKTUR'
        },
        status_pelunasan: {
            type : DataTypes.STRING,
            field: 'STATUS_PELUNASAN'
        },
        nominal_pelunasan: {
            type : DataTypes.NUMBER,
            field: 'NOMINAL_PELUNASAN'
        },
        tanggal_pelunasan: {
            type : DataTypes.DATE,
            field: 'TANGGAL_PELUNASAN'
        },
        denda_pajak: {
            type : DataTypes.NUMBER,
            field: 'DENDA_PAJAK'
        },
        pph: {
            type : DataTypes.NUMBER,
            field: 'PPH'
        },
        ppn: {
            type : DataTypes.NUMBER,
            field: 'PPN'
        },
        ppn_tarif: {
            type : DataTypes.NUMBER,
            field: 'PPN_TARIF'
        },
        wapu: {
            type : DataTypes.STRING,
            field: 'WAPU'
        },
        biaya_lain: {
            type : DataTypes.NUMBER,
            field: 'BIAYA_LAIN'
        },
        outstanding: {
            type : DataTypes.NUMBER,
            field: 'OUTSTANDING'
        },
        nominal_dpp: {
            type : DataTypes.NUMBER,
            field: 'NOMINAL_DPP'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_date: {
            type : DataTypes.DATE,
            field: 'CREATED_DATE'
        },
        updated_date: {
            type : DataTypes.DATE,
            field: 'UPDATED_DATE'
        }
    },{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_COST_OPR = db.define('D_COST_OPR',
    {
		cost_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "COST_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        kategori_cost: {
            type : DataTypes.STRING,
            field: 'KATEGORI_COST'
        },
        mata_anggaran: {
            type : DataTypes.STRING,
            field: 'MATA_ANGGARAN'
        },
        divisi_id: {
            type: DataTypes.STRING,
            field: 'DIVISI_ID'
        },
        jenis_cost: {
            type : DataTypes.STRING,
            field: 'JENIS_COST'
        },
        nilai_cost: {
            type : DataTypes.NUMBER,
            field: 'NILAI_COST'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_COST_OPR_DETAIL = db.define('D_COST_OPR_DETAIL',
    {
		cost_detail_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "COST_DETAIL_ID"
        },
        cost_id: {
            type : DataTypes.STRING,
            field: 'COST_ID'
        },
        dokumen_id: {
            type : DataTypes.STRING,
            field: 'DOKUMEN_ID'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_DOKUMEN = db.define('D_DOKUMEN', 
    {
        dokumen_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "DOKUMEN_ID"
        },
        tipe_dokumen: {
            type : DataTypes.STRING,
            field: 'TIPE_DOKUMEN'
        },
        jns_dokumen: {
            type : DataTypes.STRING,
            field: 'JNS_DOKUMEN'
        },
        no_dokumen: {
            type : DataTypes.STRING,
            field: 'NO_DOKUMEN'
        },
        tgl_dokumen: {
            type : DataTypes.DATE,
            field: 'TGL_DOKUMEN'
        },
        url_dokumen: {
            type : DataTypes.STRING,
            field: 'URL_DOKUMEN'
        },
        notes: {
            type : DataTypes.STRING,
            field: 'NOTES'
        },
        value_dok: {
            type : DataTypes.NUMBER,
            field: 'VALUE_DOK'
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        }
    },{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_PERSONIL = db.define('D_PERSONIL', 
    {
		personel_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "PERSONEL_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        position_id: {
            type : DataTypes.STRING,
            field: 'POSITION_ID'
        },
        kualifikasi_id: {
            type : DataTypes.STRING,
            field: 'KUALIFIKASI_ID'
        },
        qty_person: {
            type : DataTypes.NUMBER,
            field: 'QTY_PERSON'
        },
        satuan_person: {
            type : DataTypes.STRING,
            field: 'SATUAN_PERSON'
        },
        qty_date: {
            type : DataTypes.NUMBER,
            field: 'QTY_DATE'
        },
        satuan_date: {
            type : DataTypes.STRING,
            field: 'SATUAN_DATE'
        },
        cost_unit: {
            type: DataTypes.NUMBER,
            field: 'COST_UNIT'
        },
        cost_total: {
            type : DataTypes.NUMBER,
            field: 'COST_TOTAL'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_PERSONIL_DETAIL = db.define('D_PERSONIL_DETAIL', 
    {
		dpersonel_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "DPERSONEL_ID"
        },
        sub_dpersonel_id: {
            type : DataTypes.STRING,
            field: 'SUB_DPERSONEL_ID'
        },
        personel_id: {
            type : DataTypes.STRING,
            field: 'PERSONEL_ID'
        },
        user_id: {
            type : DataTypes.STRING,
            field: 'USER_ID'
        },
        nik: {
            type : DataTypes.STRING,
            field: 'NIK'
        },
        nama_personil: {
            type : DataTypes.STRING,
            field: 'NAMA_PERSONIL'
        },
        divisi_id: {
            type : DataTypes.STRING,
            field: 'DIVISI_ID'
        },
        qty_date: {
            type : DataTypes.NUMBER,
            field: 'QTY_DATE'
        },
        satuan_date: {
            type: DataTypes.STRING,
            field: 'SATUAN_DATE'
        },
        flag_personil: {
            type : DataTypes.STRING,
            field: 'FLAG_PERSONIL'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_PROJECT = db.define('D_PROJECT',
	{
		project_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "PROJECT_ID"
        },
        project_kategori_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_KATEGORI_ID'
        },
        project_type_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_TYPE_ID'
        },
        project_actual_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ACTUAL_ID'
        },
        project_no: {
            type : DataTypes.STRING,
            field: 'PROJECT_NO'
        },
        project_name: {
            type : DataTypes.STRING,
            field: 'PROJECT_NAME'
        },
        portofolio_id: {
            type : DataTypes.INTEGER,
            field: 'PORTOFOLIO_ID'
        },
        category_id: {
            type : DataTypes.STRING,
            field: 'CATEGORY_ID'
        },
        est_nilai_penawaran: {
            type : DataTypes.INTEGER,
            field: 'EST_NILAI_PENAWARAN'
        },
        est_cogs: {
            type : DataTypes.INTEGER,
            field: 'EST_COGS'
        },
        customer_id: {
            type : DataTypes.STRING,
            field: 'CUSTOMER_ID'
        },
        kd_area: {
            type : DataTypes.STRING,
            field: 'KD_AREA'
        },
        nilai_kontrak: {
            type : DataTypes.INTEGER,
            field: 'NILAI_KONTRAK'
        },
        cogs: {
            type : DataTypes.INTEGER,
            field: 'COGS'
        },
        contract_start: {
            type : DataTypes.DATE,
            field: 'CONTRACT_START'
        },
        contract_end: {
            type : DataTypes.DATE,
            field: 'CONTRACT_END'
        },
        kd_status: {
            type : DataTypes.STRING,
            field: 'KD_STATUS'
        },
        kd_archive: {
            type : DataTypes.STRING,
            field: 'KD_ARCHIVE'
        },
        contract_no: {
            type : DataTypes.STRING,
            field: 'CONTRACT_NO'
        },
        contract_date: {
            type : DataTypes.DATE,
            field: 'CONTRACT_DATE'
        },
        dokumen_bamk_id: {
            type : DataTypes.STRING,
            field: 'DOKUMEN_BAMK_ID'
        },
        dokumen_cbb_id: {
            type : DataTypes.STRING,
            field: 'DOKUMEN_CBB_ID'
        },
        total_direct_cost: {
            type : DataTypes.INTEGER,
            field: 'TOTAL_DIRECT_COST'
        },
        total_indirect_cost: {
            type : DataTypes.INTEGER,
            field: 'TOTAL_INDIRECT_COST'
        },
        nilai_penawaran: {
            type : DataTypes.INTEGER,
            field: 'NILAI_PENAWARAN'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        margin_presentase: {
            type: DataTypes.NUMBER,
            field: 'MARGIN_PRESENTASE'
        },
        nip_sales: {
            type: DataTypes.STRING,
            field: 'NIP_SALES'
        },
        nama_sales: {
            type: DataTypes.STRING,
            field: 'NAMA_SALES'
        },
        margin_penawaran: {
            type : DataTypes.INTEGER,
            field: 'MARGIN_PENAWARAN'
        },
        margin_kontrak: {
            type : DataTypes.INTEGER,
            field: 'MARGIN_KONTRAK'
        },
        persentase_penawaran: {
            type : DataTypes.INTEGER,
            field: 'PERSENTASE_PENAWARAN'
        },
        persentase_kontrak: {
            type : DataTypes.INTEGER,
            field: 'PERSENTASE_KONTRAK'
        },
        project_owner: {
            type : DataTypes.STRING,
            field: 'PROJECT_OWNER'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
);

exports.D_PROJECT_CBB = db.define('D_PROJECT_CBB',
    {
		cbb_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "CBB_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        divisi_id: {
            type : DataTypes.STRING,
            field: 'DIVISI_ID'
        },
        coa_id: {
            type : DataTypes.STRING,
            field: 'COA_ID'
        },
        direct_cost: {
            type : DataTypes.NUMBER,
            field: 'DIRECT_COST'
        },
        indirect_cost: {
            type : DataTypes.NUMBER,
            field: 'INDIRECT_COST'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.D_PROJECT_STATUS = db.define('D_PROJECT_STATUS',
	{
		status_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "STATUS_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        kd_status: {
            type : DataTypes.STRING,
            field: 'KD_STATUS'
        },
        date_status: {
            type : DataTypes.DATE,
            field: 'DATE_STATUS'
        },
        notes: {
            type : DataTypes.STRING,
            field: 'NOTES'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        type_status: {
            type : DataTypes.STRING,
            field: 'TYPE_STATUS'
        },
        id_tab_status: {
            type : DataTypes.STRING,
            field: 'ID_TAB_STATUS'
        },
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
);

exports.D_PROJECT_VENDOR = db.define('D_PROJECT_VENDOR', 
    {
		project_vendor_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "PROJECT_VENDOR_ID"
        },
        project_id: {
            type : DataTypes.STRING,
            field: 'PROJECT_ID'
        },
        vendor_id: {
            type : DataTypes.NUMBER,
            field: 'VENDOR_ID'
        },
        nilai_kontrak: {
            type : DataTypes.NUMBER,
            field: 'NILAI_KONTRAK'
        },
        no_kontrak: {
            type : DataTypes.STRING,
            field: 'NO_KONTRAK'
        },
        judul_kontrak: {
            type : DataTypes.STRING,
            field: 'JUDUL_KONTRAK'
        },
        start_date: {
            type : DataTypes.DATE,
            field: 'START_DATE'
        },
        end_date: {
            type : DataTypes.DATE,
            field: 'END_DATE'
        },
        flag_final: {
            type : DataTypes.STRING,
            field: 'FLAG_FINAL'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type: DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.H_LOG = db.define('H_LOG', 
    {
        id_log: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_LOG"
        },
        id_project: {
            type : DataTypes.STRING,
            field: 'ID_PROJECT'
        },
        dest: {
            type : DataTypes.STRING,
            field: 'DEST'
        },
        nama_service: {
            type : DataTypes.STRING,
            field: 'NAMA_SERVICE'
        },
        method_service: {
            type : DataTypes.STRING,
            field: 'METHOD_SERVICE'
        },
        payload_sender: {
            type : DataTypes.TEXT,
            field: 'PAYLOAD_SENDER'
        },
        payload_receiver: {
            type : DataTypes.TEXT,
            field: 'PAYLOAD_RECEIVER'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        }
    },{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.M_CUSTOMER = db.define('M_CUSTOMER',
	{
		customer_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "CUSTOMER_ID"
        },
        kode_akun: {
            type : DataTypes.STRING,
            field: 'KODE_AKUN'
        },
        customer_name: {
            type : DataTypes.STRING,
            field: 'CUSTOMER_NAME'
        },
        npwp: {
            type : DataTypes.STRING,
            field: 'NPWP'
        },
        address: {
            type : DataTypes.STRING,
            field: 'ADDRESS'
        },
        email: {
            type : DataTypes.STRING,
            field: 'EMAIL'
        },
        fax: {
            type : DataTypes.STRING,
            field: 'FAX'
        },
        telp: {
            type : DataTypes.STRING,
            field: 'TELP'
        },
        description: {
            type : DataTypes.STRING,
            field: 'DESCRIPTION'
        },
        flag_aktif: {
            type : DataTypes.STRING,
            field: 'FLAG_AKTIF'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
);

exports.M_CUSTOMER_CONTACT = db.define('M_CUSTOMER_CONTACT',
	{
		customer_contact_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "CUSTOMER_CONTACT_ID"
        },
        nama_contact: {
            type : DataTypes.STRING,
            field: 'NAMA_CONTACT'
        },
        address: {
            type : DataTypes.STRING,
            field: 'ADDRESS'
        },
        email: {
            type : DataTypes.STRING,
            field: 'EMAIL'
        },
        phone: {
            type : DataTypes.STRING,
            field: 'PHONE'
        },
        jabatan: {
            type : DataTypes.STRING,
            field: 'JABATAN'
        },
        gender: {
            type : DataTypes.STRING,
            field: 'GENDER'
        },
        birthdate: {
            type : DataTypes.DATE,
            field: 'BIRTHDATE'
        },
        membawahi: {
            type : DataTypes.STRING,
            field: 'MEMBAWAHI'
        },
        description: {
            type : DataTypes.STRING,
            field: 'DESCRIPTION'
        },
        customer_id: {
            type : DataTypes.STRING,
            field: 'CUSTOMER_ID'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
);

exports.M_MENU = db.define('M_MENU', 
    {
        id_menu: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_MENU"
        },
        menu_text: {
            type: DataTypes.STRING,
            field: "MENU_TEXT"
        },
        menu_url: {
            type: DataTypes.STRING,
            field: "MENU_URL"
        },
        id_parent_menu: {
            type: DataTypes.NUMBER,
            field: "ID_PARENT_MENU"
        },
        icon: {
            type: DataTypes.STRING,
            field: "ICON"
        },
        order_position: {
            type: DataTypes.NUMBER,
            field: "ORDER_POSITION"
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
    },{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.M_PORTOFOLIO = db.define('M_PORTOFOLIO',
	{
		portofolio_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "PORTOFOLIO_ID"
        },
        tahun: {
            type : DataTypes.STRING,
            field: 'TAHUN'
        },
        kode: {
            type : DataTypes.STRING,
            field: 'KODE'
        },
        kode_akun: {
            type : DataTypes.STRING,
            field: 'KODE_AKUN'
        },
        portofolio: {
            type : DataTypes.STRING,
            field: 'PORTOFOLIO'
        },
        keterangan: {
            type : DataTypes.STRING,
            field: 'KETERANGAN'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
	},{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
);

exports.M_REFERENSI = db.define('M_REFERENSI', 
    {
        kd_ref: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            field: "KD_REF"
        },
        ur_ref: {
            type : DataTypes.STRING,
            field: 'UR_REF'
        },
        jns_ref: {
            type : DataTypes.STRING,
            field: 'JNS_REF'
        },
        sub_kd_ref: {
            type : DataTypes.STRING,
            field: 'SUB_KD_REF'
        },
        sub_jns_ref: {
            type : DataTypes.STRING,
            field: 'SUB_JNS_REF'
        },
        flag_aktif: {
            type : DataTypes.STRING,
            field: 'FLAG_AKTIF'
        },
        created_at: {
            type : DataTypes.STRING,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.STRING,
            field: 'UPDATED_AT'
        },
        created_date: {
            type : DataTypes.DATE,
            field: 'CREATED_DATE'
        },
        updated_date: {
            type : DataTypes.DATE,
            field: 'UPDATED_DATE'
        },
        start_date: {
            type : DataTypes.DATE,
            field: 'START_DATE'
        },
        end_date: {
            type : DataTypes.DATE,
            field: 'END_DATE'
        }
    },{
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.M_VENDOR_KONTAK = db.define("M_VENDOR_KONTAK", 
    {
        vendor_kontak_id: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true,
            field: "VENDOR_KONTAK_ID"
        },
        vendor_id: {
            type : DataTypes.NUMBER,
            field: 'VENDOR_ID'
        },
        nama: {
            type : DataTypes.STRING,
            field: 'NAMA'
        },
        no_telp: {
            type : DataTypes.STRING,
            field: 'NO_TELP'
        },
        email: {
            type : DataTypes.STRING,
            field: 'EMAIL'
        },
        jabatan: {
            type : DataTypes.STRING,
            field: 'JABATAN'
        },
        status: {
            type : DataTypes.STRING,
            field: 'STATUS'
        },
        keterangan: {
            type : DataTypes.STRING,
            field: 'KETERANGAN'
        },
        alamat: {
            type : DataTypes.STRING,
            field: 'ALAMAT'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
    }, {
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)

exports.M_VENDOR_PT = db.define("M_VENDOR_PT",
    {
        vendor_id: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true,
            field: "VENDOR_ID"
        },
        nama_perusahaan: {
            type : DataTypes.STRING,
            field: 'NAMA_PERUSAHAAN'
        },
        alamat_perusahaan: {
            type : DataTypes.STRING,
            field: 'ALAMAT_PERUSAHAAN'
        },
        npwp: {
            type : DataTypes.STRING,
            field: 'NPWP'
        },
        no_telp: {
            type : DataTypes.STRING,
            field: 'NO_TELP'
        },
        email: {
            type : DataTypes.STRING,
            field: 'EMAIL'
        },
        status: {
            type : DataTypes.STRING,
            field: 'STATUS'
        },
        keterangan: {
            type : DataTypes.STRING,
            field: 'KETERANGAN'
        },
        created_at: {
            type : DataTypes.DATE,
            field: 'CREATED_AT'
        },
        updated_at: {
            type : DataTypes.DATE,
            field: 'UPDATED_AT'
        },
        created_by: {
            type : DataTypes.STRING,
            field: 'CREATED_BY'
        },
        updated_by: {
            type : DataTypes.STRING,
            field: 'UPDATED_BY'
        }
    }, {
        schema: 'N2N',
        freezeTableName: true,
        timestamps: false
    }
)