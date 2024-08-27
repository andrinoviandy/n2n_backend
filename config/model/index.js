const n2n = require('./n2n/n2n')
const model = {}

model.d_billing = n2n.D_BILLING
model.d_billing_dokumen = n2n.D_BILLING_DOKUMEN
model.d_billing_revenue = n2n.D_BILLING_REVENUE
model.d_cost_opr = n2n.D_COST_OPR
model.d_cost_opr_detail = n2n.D_COST_OPR_DETAIL
model.d_dokumen = n2n.D_DOKUMEN
model.d_personil = n2n.D_PERSONIL
model.d_personil_detail = n2n.D_PERSONIL_DETAIL
model.d_project = n2n.D_PROJECT
model.d_project_cbb = n2n.D_PROJECT_CBB
model.d_project_status = n2n.D_PROJECT_STATUS
model.d_project_vendor = n2n.D_PROJECT_VENDOR
model.h_log = n2n.H_LOG
model.m_customer = n2n.M_CUSTOMER
model.m_customer_contact = n2n.M_CUSTOMER_CONTACT
model.m_menu = n2n.M_MENU
model.m_portofolio = n2n.M_PORTOFOLIO
model.m_referensi = n2n.M_REFERENSI
model.m_vendor_kontak = n2n.M_VENDOR_KONTAK
model.m_vendor_pt = n2n.M_VENDOR_PT

module.exports = model