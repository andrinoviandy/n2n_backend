const express = require('express');
const router = express.Router();
const controller = require('../controllers/index')
const authorization = require('../middlewares/authorization')
const swagger = require('../middlewares/swagger')

/* GET home page. */
router.get('/getListMenu', swagger.getListMenu, authorization.doAuth, controller.main.getListMenu);
router.get('/getAcl', swagger.getAcl, controller.main.getAcl)
router.get('/getPermissionCrud', swagger.getPermissionCrud, authorization.doAuth, controller.main.getPermissionCrud);

// Project
router.post('/insertNewProject', swagger.insertNewProject, authorization.doAuth, controller.main.insertNewProject);
router.put('/updateProject', swagger.updateProject, authorization.doAuth, controller.main.updateProject)
router.get('/getListProject', swagger.getListProject, controller.main.getListProject);
router.get('/getDetailProject', swagger.getDetailProject, authorization.doAuth, controller.main.getDetailProject)
router.post('/markAsProject', swagger.markAsProject, authorization.doAuth, controller.main.markAsProject)
router.post('/markAsArchive', swagger.markAsArchive, authorization.doAuth, controller.main.markAsArchive)
router.post('/markAsUnarchive', swagger.markAsUnarchive, authorization.doAuth, controller.main.markAsUnarchive)
router.post('/markAsActualID', swagger.markAsActualID, authorization.doAuth, controller.main.markAsActualID)
router.post('/markAsAcceleration', swagger.markAsAcceleration, authorization.doAuth, controller.main.markAsAcceleration)
router.post('/insertProjectStatus', swagger.insertProjectStatus, authorization.doAuth, controller.main.insertProjectStatus)
// get project for cost personil
router.get('/getListProjectForCostPersonil', swagger.getListProjectForCostPersonil, controller.main.getListProjectForCostPersonil);
// get detail cost personil & operasional
router.get('/getDetailCostPersonil', swagger.getDetailCostPersonil, controller.main.getDetailCostPersonil);
router.get('/getDetailCostPersonilDetail', swagger.getDetailCostPersonilDetail, controller.main.getDetailCostPersonilDetail);
router.get('/getDetailCostOperasional', swagger.getDetailCostOperasional, controller.main.getDetailCostOperasional);
router.get('/getDetailVendorProjectBilling', swagger.getDetailVendorProjectBilling, controller.main.getDetailVendorProjectBilling);
router.get('/getDetailCostOperasionalWithDokumenByCostId', swagger.getDetailCostOperasionalWithDokumenByCostId, controller.main.getDetailCostOperasionalWithDokumenByCostId);
// get project for cost operasional
router.get('/getListProjectForCostOperasional', swagger.getListProjectForCostOperasional, controller.main.getListProjectForCostOperasional);
router.get('/getListProjectForVendorProjectBilling', swagger.getListProjectForVendorProjectBilling, controller.main.getListProjectForVendorProjectBilling);
// get project billing - cost stream
router.get('/getListProjectForCostAdvanced', swagger.getListProjectForCostAdvanced, controller.main.getListProjectForCostAdvanced);
router.get('/getDetailCostAdvance', swagger.getDetailCostAdvance, controller.main.getDetailCostAdvance);
router.get('/getListProjectForTagihanVendor', swagger.getListProjectForTagihanVendor, controller.main.getListProjectForTagihanVendor);
router.get('/getDetailTagihanVendor', swagger.getDetailTagihanVendor, controller.main.getDetailTagihanVendor);
// personil detail && operational detail
router.delete('/deletePersonilDetail/:dpersonel_id', swagger.deletePersonilDetail, authorization.doAuth, controller.main.deletePersonilDetail)
router.delete('/deleteOperationalDetail/:cost_id', swagger.deleteOperationalDetail, authorization.doAuth, controller.main.deleteOperationalDetail)
// insert personil detail && operational detail
router.post('/insertPersonilDetail', swagger.insertPersonilDetail, authorization.doAuth, controller.main.insertPersonilDetail)
router.post('/insertOperationalDetail', swagger.insertOperationalDetail, authorization.doAuth, controller.main.insertOperationalDetail)
router.post('/insertOperationalDetailDokumen', swagger.insertOperationalDetailDokumen, authorization.doAuth, controller.main.insertOperationalDetailDokumen)
router.post('/insertBillingDokumen', swagger.insertBillingDokumen, authorization.doAuth, controller.main.insertBillingDokumen)

// Dokumen
router.post('/uploadDokumen', swagger.uploadDokumen, authorization.doAuth, controller.main.insertDokumen)
router.delete('/deleteDokumen/:dokumen_id', swagger.deleteDokumen, authorization.doAuth, controller.main.deleteDokumen)
router.post('/uploadDokumenBAMK', swagger.uploadDokumenBAMK, authorization.doAuth, controller.main.insertDokumenBAMK)
router.delete('/deleteDokumenBAMK', swagger.deleteDokumenBAMK, authorization.doAuth, controller.main.deleteDokumenBAMK)

// Billing
router.post('/billingCollection', swagger.billingCollection, authorization.doAuth, controller.main.postBillingCollection)
router.get('/getBillingCollection', swagger.getBillingCollection, controller.main.getBillingCollection)
router.delete('/deleteBillingCollection/:billing_id', swagger.deleteBillingCollection, authorization.doAuth, controller.main.deleteBillingCollection)
router.delete('/deleteBillingDokumen/:billing_detail_id', swagger.deleteBillingDokumen, authorization.doAuth, controller.main.deleteBillingDokumen)
router.put('/updateKdStatus', swagger.updateKdStatus, authorization.doAuth, controller.main.updateKdStatus)
router.get('/getListBillingByTermin', swagger.getListBillingByTermin, controller.main.getListBillingByTermin);

// Vendor
router.post('/vendorPlanning', swagger.vendorPlanning, authorization.doAuth, controller.main.postVendorPlanning)
router.get('/getVendorPlanning', swagger.getVendorPlanning, controller.main.getVendorPlanning)
router.delete('/deleteVendorPlanning/:project_vendor_id', swagger.deleteVendorPlanning, authorization.doAuth, controller.main.deleteVendorPlanning)

// CBB
router.post('/CBBPlanning', swagger.CBBPlanning, authorization.doAuth, controller.main.postCBBPlanning)
router.get('/getCBBPlanning', swagger.getCBBPlanning, controller.main.getCBBPlanning)
router.delete('/deleteCBBPlanning/:cbb_id', authorization.doAuth, controller.main.deleteCBBPlanning)

// Cost Personil
router.post('/costPersonilPlanning', swagger.costPersonilPlanning, authorization.doAuth, controller.main.costPersonilPlanning)
router.get('/getCostPersonilPlanning', swagger.getCostPersonilPlanning, controller.main.getCostPersonilPlanning)
router.delete('/deleteCostPersonilPlanning/:personel_id', controller.main.deleteCostPersonilPlanning)

// Vendor
router.get('/getListVendor', swagger.getListVendor, controller.main.getListVendor)
router.get('/getListProjectVendor', swagger.getListProjectVendor, controller.main.getListProjectVendor)
router.get('/getDetailProjectVendor', swagger.getDetailProjectVendor, controller.main.getDetailProjectVendor)

router.get('/getProjectByType', swagger.getProjectByType, authorization.doAuth, controller.main.getProjectByType)

// Projec Billing
router.get('/getDetailVendorRealization', swagger.getDetailVendorRealization, controller.main.getDetailVendorRealization)
router.post('/dataRevenueStream', swagger.dataRevenueStream, controller.main.dataRevenueStream)
// router.get('/getBillingRealization', swagger.getBillingRealization, controller.main.getBillingRealization)
router.get('/getBillingDocument', swagger.getBillingDocument, controller.main.getBillingDocument)
router.get('/getListBillingRevenue', swagger.getListBillingRevenue, controller.main.getListBillingRevenue)
router.get('/getDetailBillingRevenue', swagger.getDetailBillingRevenue, controller.main.getDetailBillingRevenue)
//Master Customer
router.get('/getListCustomer', swagger.getListCustomer, controller.main.getListCustomer)
router.get('/getDetailCustomer', swagger.getDetailCustomer, controller.main.getDetailCustomer)
router.post('/insertCustomer', swagger.insertCustomer, authorization.doAuth, controller.main.insertCustomer);
router.put('/updateCustomer', swagger.updateCustomer, authorization.doAuth, controller.main.updateCustomer)
router.post('/insertContactCustomer', swagger.insertContactCustomer, authorization.doAuth, controller.main.insertContactCustomer);
router.delete('/deleteContactCustomer/:customer_contact_id', controller.main.deleteContactCustomer)
//Master Referensi
router.post('/insertReferensi', swagger.insertReferensi, authorization.doAuth, controller.main.insertReferensi);
router.get('/getListReferensi', swagger.getListReferensi, controller.main.getListReferensi)

// Add on
router.get('/getReferensiByJenis', swagger.getReferensiByJenis, controller.main.getReferensiByJenis)
router.get('/getSubReferensiByJenis', swagger.getSubReferensiByJenis, controller.main.getSubReferensiByJenis)
router.get('/getRefStatusProject', swagger.getRefStatusProject, controller.main.getRefStatusProject)
router.get('/getRefStatus', swagger.getRefStatus, controller.main.getRefStatus)
router.get('/getPortofolio', swagger.getPortofolio, controller.main.getPortofolio)
router.get('/getCustomers', swagger.getCustomers, controller.main.getCustomers)
router.get('/getStartDate', swagger.getStartDate, controller.main.getStartDate)

// router.get('/getDetailProjectProfile', swagger.getDetailProjectProfile, authorization.doAuth, controller.main.getDetailProjectProfile)

module.exports = router;