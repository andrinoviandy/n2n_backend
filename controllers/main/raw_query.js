const query = {}

query.getListMenu = `SELECT
CASE
    WHEN data IS NULL OR data = '{"menu":null}' then 'Failed'
    ELSE 'Success'
END message,
data
FROM
(SELECT
    JSON_OBJECT('menu' VALUE JSON_ARRAYAGG(MENU)) data
FROM
    (SELECT
            JSON_OBJECT('id' VALUE a.ID_MENU,
                        'id_acl' VALUE MR.kd_ref,
                        'name' VALUE a.MENU_TEXT,
                        'path' VALUE a.MENU_URL,
                        'parent' VALUE a.ID_PARENT_MENU,
                        'submenu' VALUE (
                                       SELECT JSON_ARRAYAGG(JSON_OBJECT('id' VALUE b.ID_MENU,
                                                                        'id_acl' VALUE MR2.kd_ref,
                                                                        'name' VALUE b.MENU_TEXT,
                                                                        'path' VALUE a.MENU_URL||b.MENU_URL,
                                                                        'parent' VALUE b.ID_PARENT_MENU,
                                                                        'submenu' VALUE (
                                                                                           SELECT JSON_ARRAYAGG(JSON_OBJECT('id' VALUE c.ID_MENU,
                                                                                                                            'id_acl' VALUE MR3.kd_ref,
                                                                                                                            'name' VALUE c.MENU_TEXT,
                                                                                                                            'path' VALUE a.MENU_URL||b.MENU_URL||c.MENU_URL,
                                                                                                                            'parent' VALUE c.ID_PARENT_MENU))
                                                                                           FROM M_MENU c
                                                                                           JOIN M_REFERENSI MR3 on c.ID_MENU = MR3.UR_REF AND MR3.JNS_REF = 'acl_has_menu'
                                                                                           WHERE c.ID_PARENT_MENU = b.ID_MENU AND c.ORDER_POSITION = '2' AND MR3.SUB_KD_REF = :kd_ref AND MR3.FLAG_AKTIF = 'Y'
                                                                                       )))
                                       FROM M_MENU b
                                       JOIN M_REFERENSI MR2 on b.ID_MENU = MR2.UR_REF AND MR2.JNS_REF = 'acl_has_menu'
                                       WHERE b.ID_PARENT_MENU = a.ID_MENU AND b.ORDER_POSITION = '1' AND MR2.SUB_KD_REF = :kd_ref AND MR2.FLAG_AKTIF = 'Y'
                                      )) as MENU
    FROM M_MENU a
    JOIN M_REFERENSI MR on a.ID_MENU = MR.UR_REF AND MR.JNS_REF = 'acl_has_menu'
    WHERE
        a.ORDER_POSITION = '0'
    AND MR.SUB_KD_REF = :kd_ref
    AND MR.FLAG_AKTIF = 'Y') PARENT) MENUS`

query.getReferensiByJenis = `select
    a.KD_REF as "kd_ref",
    a.UR_REF as "ur_ref",
    a.SUB_KD_REF as "sub_kd_ref",
    b.UR_REF as "sub_ur_ref"
from n2n.M_REFERENSI a
left join n2n.M_REFERENSI b ON b.KD_REF = a.SUB_KD_REF and b.JNS_REF = a.SUB_JNS_REF
where
    a.JNS_REF = :jns_ref
and
    a.FLAG_AKTIF = 'Y'
and
    (UPPER(a.KD_REF) like upper(:keyword) OR UPPER(A.UR_REF) LIKE upper(:keyword))`

query.getPermissionCrud = `
SELECT
    menu.KD_REF as "menu",
    permissions.KD_REF as "id_akses",
    ur_permissions.UR_REF as "ur_akses",
    menu.SUB_KD_REF as "hak_akses",
    permissions.JNS_REF
FROM M_REFERENSI menu
JOIN M_REFERENSI permissions ON permissions.SUB_KD_REF = menu.KD_REF AND permissions.JNS_REF = 'acl_has_permissions'
JOIN M_REFERENSI ur_permissions ON ur_permissions.KD_REF = permissions.KD_REF AND ur_permissions.JNS_REF = 'ref_permissions'
WHERE menu.JNS_REF = 'acl_has_menu'
  AND menu.SUB_KD_REF = :kd_ref`

query.getRoleUser = `
SELECT a.* FROM n2n.M_ROLE a WHERE a."RoleId" = :kode`

query.getRefStatusProject = `(SELECT
   JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
               'ur_status' VALUE a.URAIAN,
               'tab_status' VALUE a.ID_TAB_STATUS,
               'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_STATUS AND b.KD_ARCHIVE IS NULL
where
    a.KD_STATUS = '001'
AND a.ID_TAB_STATUS = 'SA1'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL

(SELECT
   JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
               'ur_status' VALUE a.URAIAN,
               'tab_status' VALUE a.ID_TAB_STATUS,
               'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_STATUS AND b.KD_ARCHIVE IS NULL
where
    a.KD_STATUS = '002'
AND a.ID_TAB_STATUS = 'SA1'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL
(SELECT
   JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
               'ur_status' VALUE a.URAIAN,
               'tab_status' VALUE a.ID_TAB_STATUS,
               'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_STATUS AND b.KD_ARCHIVE IS NULL
where
    a.KD_STATUS = '003'
AND a.ID_TAB_STATUS = 'SA1'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL
(SELECT
   JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
               'ur_status' VALUE a.URAIAN,
               'tab_status' VALUE a.ID_TAB_STATUS,
               'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_STATUS AND b.KD_ARCHIVE IS NULL
where
    a.KD_STATUS = '004'
AND a.ID_TAB_STATUS = 'SA1'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL
(SELECT
  JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
            'ur_status' VALUE a.URAIAN,
            'tab_status' VALUE a.ID_TAB_STATUS,
            'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_ARCHIVE AND b.KD_ARCHIVE = '101'
where
    a.KD_STATUS = '101'
AND a.ID_TAB_STATUS = 'SA2'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL
(SELECT
  JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
            'ur_status' VALUE a.URAIAN,
            'tab_status' VALUE a.ID_TAB_STATUS,
            'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_ARCHIVE AND b.KD_ARCHIVE = '102'
where
    a.KD_STATUS = '102'
AND a.ID_TAB_STATUS = 'SA2'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)
UNION ALL
(SELECT
  JSON_OBJECT('kd_status' VALUE a.KD_STATUS,
            'ur_status' VALUE a.URAIAN,
            'tab_status' VALUE a.ID_TAB_STATUS,
            'total_data' VALUE count(b.PROJECT_ID)) data
FROM n2n.M_STATUS a
LEFT JOIN n2n.D_PROJECT b ON a.KD_STATUS = b.KD_ARCHIVE AND b.KD_ARCHIVE = '103'
where
    a.KD_STATUS = '103'
AND a.ID_TAB_STATUS = 'SA2'
GROUP BY a.KD_STATUS, a.URAIAN, a.ID_TAB_STATUS)`

query.getRefStatus = `SELECT a.KD_STATUS, a.URAIAN 
FROM n2n.M_STATUS a 
where
    a.ID_TAB_STATUS = :id_tab_status 
order by a.KD_STATUS asc`

query.getDataProject = `SELECT
   a.*,
   b.UR_REF as "PROJECT_KATEGORI_UR",
   c.UR_REF as "PROJECT_TYPE_UR",
   d.PORTOFOLIO as "PORTOFOLIO_UR",
   e.UR_REF as "CATEGORY_UR",
   f.CUSTOMER_NAME,
   g.UR_REF as "UR_AREA",
   h.UR_REF as "UR_STATUS"
FROM n2n.D_PROJECT a
LEFT JOIN n2n.M_REFERENSI b ON b.KD_REF = a.PROJECT_KATEGORI_ID AND b.JNS_REF = lower('PROJECT_KATEGORI_ID')
LEFT JOIN n2n.M_REFERENSI c ON c.KD_REF = a.PROJECT_TYPE_ID AND c.JNS_REF = lower('PROJECT_TYPE_ID')
LEFT JOIN n2n.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = TO_NUMBER(a.PORTOFOLIO_ID)
LEFT JOIN n2n.M_REFERENSI e ON e.KD_REF = a.CATEGORY_ID AND e.JNS_REF = lower('CATEGORY_ID')
LEFT JOIN n2n.M_CUSTOMER f ON f.CUSTOMER_ID = a.CUSTOMER_ID AND f.FLAG_AKTIF = 'Y'
LEFT JOIN n2n.M_REFERENSI g ON g.KD_REF = a.KD_AREA AND g.JNS_REF = lower('KD_AREA')
LEFT JOIN n2n.M_REFERENSI h ON h.KD_REF = a.KD_STATUS AND h.JNS_REF = lower('KD_STATUS')
where
    a.project_id = :project_id`

query.getListProject = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.*,
   b.UR_REF as "PROJECT_KATEGORI_UR",
   c.UR_REF as "PROJECT_TYPE_UR",
   d.PORTOFOLIO as "PORTOFOLIO_UR",
   e.UR_REF as "CATEGORY_UR",
   f.CUSTOMER_NAME,
   g.UR_REF as "UR_AREA",
   h.URAIAN as "UR_STATUS",
   v1.SLA,
   (SELECT
        COUNT(x3.PROJECT_ID)
    FROM D_PROJECT x3
    WHERE x3.PROJECT_TYPE_ID = '2'
    AND x3.PROJECT_ACTUAL_ID = a.PROJECT_ID) AS "TOTAL_AKSELERASI",
   (SELECT TO_NUMBER(
        CASE
            WHEN
                    a.PROJECT_TYPE_ID = '1'
                AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') >= 1
                AND a.KD_STATUS in ('002','003')
                AND a.KD_ARCHIVE IS NULL
                AND (SELECT COUNT(x2.PROJECT_ID) FROM N2N.D_PROJECT x2 WHERE x2.PROJECT_ACTUAL_ID = a.PROJECT_ID AND x2.PROJECT_TYPE_ID = '2') = 0
                    THEN '1' --TO ACCELERATION
            ELSE '0'
        END) "TOTAL"
    FROM DUAL) AS "TO_AKSELERASI",
    (SELECT TO_NUMBER(
        CASE
            WHEN a.PROJECT_TYPE_ID = '1' AND a.KD_ARCHIVE IS NULL THEN '1' --TO ACCELERATION
            WHEN a.PROJECT_TYPE_ID = '2'
                 AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') >= 1
                 AND a.KD_STATUS in ('002')
                 AND a.KD_ARCHIVE IS NULL 
                THEN '1' --MARK AS
            ELSE '0'
        END) "TOTAL"
    FROM DUAL) AS "TO_MARK",
    (CASE
        WHEN a.PROJECT_TYPE_ID = '2' THEN 'Tipe Project Bukan Project Normal'
        WHEN a.PROJECT_TYPE_ID = '1'
            AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') = 0
                THEN 'Belum terdapat Dokumen Pendukung'
        WHEN a.PROJECT_TYPE_ID = '1'
            AND a.KD_STATUS NOT IN ('002','003') 
                THEN 'Status Project Tidak Dapat Dilakukan Perubahan Tipe'
        WHEN a.PROJECT_TYPE_ID = '1' 
            AND a.KD_ARCHIVE IS NOT NULL 
                THEN 'Status Project Sedang di Archive'
        WHEN a.PROJECT_TYPE_ID = '1' 
            AND (SELECT COUNT(x2.PROJECT_ID) FROM N2N.D_PROJECT x2 WHERE x2.PROJECT_ACTUAL_ID = a.PROJECT_ID AND x2.PROJECT_TYPE_ID = '2') > 0
                THEN 'Project Telah di Actualkan' --TO ACCELERATION
        ELSE '' END
    ) AS "KET_AKSELERASI", 
    (CASE
        WHEN a.PROJECT_TYPE_ID = '2' AND a.KD_STATUS = '003' THEN 'Project Akselerasi Tidak Dapat Dilakukan Perubahan Menjadi Won'
        WHEN a.KD_STATUS = '002' AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') = 0
            THEN 'Belum terdapat Dokumen Pendukung' 
        ELSE '' END
    ) AS "KET_MARK" 
FROM n2n.D_PROJECT a
LEFT JOIN n2n.M_REFERENSI b ON b.KD_REF = a.PROJECT_KATEGORI_ID AND b.JNS_REF = lower('PROJECT_KATEGORI_ID')
LEFT JOIN n2n.M_REFERENSI c ON c.KD_REF = a.PROJECT_TYPE_ID AND c.JNS_REF = lower('PROJECT_TYPE_ID')
LEFT JOIN n2n.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = TO_NUMBER(a.PORTOFOLIO_ID)
LEFT JOIN n2n.M_REFERENSI e ON e.KD_REF = a.CATEGORY_ID AND e.JNS_REF = lower('CATEGORY_ID')
LEFT JOIN n2n.M_CUSTOMER f ON f.CUSTOMER_ID = a.CUSTOMER_ID AND f.FLAG_AKTIF = 'Y'
LEFT JOIN n2n.M_REFERENSI g ON g.KD_REF = a.KD_AREA AND g.JNS_REF = lower('KD_AREA')
LEFT JOIN n2n.M_STATUS h ON h.KD_STATUS = a.KD_STATUS AND h.ID_TAB_STATUS = 'SA1' 
LEFT JOIN n2n.V_SLA v1 ON v1.PROJECT_ID = a.PROJECT_ID 
WHERE
    (a.PROJECT_NO like :keyword
    OR upper(a.PROJECT_NAME) like upper(:keyword)
    OR upper(d.PORTOFOLIO) like upper(:keyword)
    OR upper(c.UR_REF) like upper(:keyword)
    OR upper(f.CUSTOMER_NAME) like upper(:keyword)
    OR a.CONTRACT_NO like :keyword
    OR upper(h.URAIAN) like upper(:keyword)) :archive_condition
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.countListProject = `SELECT
   count(a.PROJECT_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit"
FROM n2n.D_PROJECT a 
:condition`;

query.getListProjectForCostPersonil = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.PROJECT_ID, 
   a.PROJECT_NO, 
   a.PROJECT_NAME, 
   a.NILAI_KONTRAK,
   m1.PORTOFOLIO as "PORTOFOLIO_UR", 
   m2.UR_REF as "PROJECT_TYPE_UR",
   (select sum(b.COST_TOTAL) from n2n.D_PERSONIL b where b.PROJECT_ID = a.PROJECT_ID) TOTAL_COST 
FROM n2n.D_PROJECT a 
    LEFT JOIN n2n.M_PORTOFOLIO m1 ON m1.PORTOFOLIO_ID = a.PORTOFOLIO_ID 
    LEFT JOIN n2n.M_REFERENSI m2 ON m2.KD_REF = a.PROJECT_TYPE_ID AND m2.JNS_REF = lower('PROJECT_TYPE_ID') 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.getProjectForCostPersonil = `SELECT
   a.*,
   b.UR_REF as "PROJECT_KATEGORI_UR",
   c.UR_REF as "PROJECT_TYPE_UR",
   d.PORTOFOLIO as "PORTOFOLIO_UR", 
   e.UR_REF as "CATEGORY_UR",
   f.CUSTOMER_NAME,
   (select sum(b.COST_TOTAL) from n2n.D_PERSONIL b where b.PROJECT_ID = a.PROJECT_ID) TOTAL_COST 
FROM n2n.D_PROJECT a 
LEFT JOIN n2n.M_REFERENSI b ON b.KD_REF = a.PROJECT_KATEGORI_ID AND b.JNS_REF = lower('PROJECT_KATEGORI_ID')
LEFT JOIN n2n.M_REFERENSI c ON c.KD_REF = a.PROJECT_TYPE_ID AND c.JNS_REF = lower('PROJECT_TYPE_ID') 
LEFT JOIN n2n.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = TO_NUMBER(a.PORTOFOLIO_ID) 
LEFT JOIN n2n.M_REFERENSI e ON e.KD_REF = a.CATEGORY_ID AND e.JNS_REF = lower('CATEGORY_ID') 
LEFT JOIN n2n.M_CUSTOMER f ON f.CUSTOMER_ID = a.CUSTOMER_ID AND f.FLAG_AKTIF = 'Y' 
WHERE a.PROJECT_ID = :project_id`

query.getProjectForCostOperasional = `SELECT
   a.PROJECT_ID, 
   a.PROJECT_NO, 
   a.PROJECT_NAME, 
   a.NILAI_KONTRAK, 
   (select sum(b.NILAI_COST) from n2n.D_COST_OPR b where b.PROJECT_ID = a.PROJECT_ID) TOTAL_COST 
FROM n2n.D_PROJECT a WHERE a.PROJECT_ID = :project_id`

query.countListProjectForCostPersonil = `SELECT
   count(a.PROJECT_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_PROJECT a  
:condition`;

query.getDetailCostPersonil = `SELECT 
    ROW_NUMBER() OVER (ORDER BY b.POSITION_ID ASC) AS row_number,
    b.*,
   -- c.PERSONEL_ID, 
   -- c.USER_ID, 
   -- c.NIK, 
   -- c.NAMA_PERSONIL, 
   m1.UR_REF POSITION,
   m2.UR_REF KUALIFIKASI,
   -- c.DIVISI_ID,
   -- m3.UR_REF DIVISI,
   m4.UR_REF UR_SATUAN_PERSON, 
   m5.UR_REF UR_SATUAN_DATE  
FROM 
    n2n.D_PERSONIL b 
    -- left join n2n.D_PERSONIL_DETAIL c on b.PERSONEL_ID = c.PERSONEL_ID 
    left join M_REFERENSI m1 on m1.KD_REF = b.position_id and m1.JNS_REF = lower('POSITION_ID') 
    left join M_REFERENSI m2 on m2.KD_REF = b.kualifikasi_id and m2.JNS_REF = lower('KUALIFIKASI_ID') 
    -- left join M_REFERENSI m3 on m3.KD_REF = c.divisi_id and m3.JNS_REF = lower('DIVISI_ID') 
    left join M_REFERENSI m4 on m4.KD_REF = b.satuan_person and m4.JNS_REF = lower('SATUAN_PERSON') 
    left join M_REFERENSI m5 on m5.KD_REF = b.satuan_person and m5.JNS_REF = lower('SATUAN_DATE') 
WHERE 
    b.PROJECT_ID = :project_id 
ORDER BY b.POSITION_ID ASC`

query.getDetailCostPersonilDetail = `SELECT 
    ROW_NUMBER() OVER (ORDER BY b.NAMA_PERSONIL ASC) AS row_number,
    b.*,
    m3.UR_REF divisi,
    m4.UR_REF satuan   
FROM 
    n2n.D_PERSONIL_DETAIL b 
    left join M_REFERENSI m3 on m3.KD_REF = b.divisi_id and m3.JNS_REF = lower('DIVISI_ID') 
    left join M_REFERENSI m4 on m4.KD_REF = b.satuan_date and m4.JNS_REF = lower('SATUAN_DATE') 
WHERE 
    b.PERSONEL_ID = :personel_id 
ORDER BY b.NAMA_PERSONIL ASC`

query.getDetailCostOperasional = `SELECT 
    ROW_NUMBER() OVER (ORDER BY b.COST_ID ASC) AS row_number,
   b.*, 
   m3.UR_REF DIVISI 
FROM 
    n2n.D_COST_OPR b left join M_REFERENSI m3 on m3.KD_REF = b.divisi_id and m3.JNS_REF = lower('DIVISI_ID') 
WHERE 
    b.PROJECT_ID = :project_id 
ORDER BY b.COST_ID ASC`

query.getDetailCostOperasionalWithDokumenByCostId = `SELECT
   a.*,
   b.PROJECT_NO, 
   b.PROJECT_NAME, 
   b.NILAI_KONTRAK  
FROM n2n.D_COST_OPR a left join n2n.D_PROJECT b on a.PROJECT_ID = b.PROJECT_ID WHERE a.COST_ID = :cost_id`

query.getDetailDokumenCostOperasional = `SELECT 
	c.COST_DETAIL_ID,
    a.DOKUMEN_ID,
	a.TIPE_DOKUMEN ,
	a.JNS_DOKUMEN,
	b.UR_REF AS "URAIAN_JENIS",
	a.NO_DOKUMEN,
	TO_CHAR(a.TGL_DOKUMEN, 'DD/MM/YYYY') AS "TGL_DOKUMEN",
	CASE 
		WHEN a.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', a.URL_DOKUMEN)
		ELSE a.URL_DOKUMEN
	END URL_DOKUMEN,
	a.NOTES,
	a.VALUE_DOK 
FROM
	N2N.D_COST_OPR_DETAIL c LEFT JOIN N2N.D_DOKUMEN a ON c.DOKUMEN_ID = a.DOKUMEN_ID 
    LEFT JOIN N2N.M_REFERENSI b ON b.KD_REF = a.JNS_DOKUMEN 
WHERE 
	c.COST_ID = :cost_id`

query.getListProjectForCostOperasional = `
SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.PROJECT_ID, 
   a.PROJECT_NO, 
   a.PROJECT_NAME, 
   a.NILAI_KONTRAK, 
   m1.PORTOFOLIO as "PORTOFOLIO_UR", 
   m2.UR_REF as "PROJECT_TYPE_UR",
   (select sum(b.NILAI_COST) from n2n.D_COST_OPR b where b.PROJECT_ID = a.PROJECT_ID) TOTAL_COST 
FROM n2n.D_PROJECT a 
    LEFT JOIN n2n.M_PORTOFOLIO m1 ON m1.PORTOFOLIO_ID = a.PORTOFOLIO_ID 
    LEFT JOIN n2n.M_REFERENSI m2 ON m2.KD_REF = a.PROJECT_TYPE_ID AND m2.JNS_REF = lower('PROJECT_TYPE_ID') 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.countListProjectForCostOperasional = `SELECT
   count(a.PROJECT_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_PROJECT a 
:condition`;

query.getVendorProjectBilling = `SELECT
   c.PROJECT_ID, 
   a.BILLING_ID, 
   c.PROJECT_NO, 
   c.PROJECT_NAME, 
   b.NILAI_KONTRAK,
   b.NO_KONTRAK,
   b.VENDOR_ID, 
   m.NAMA_PERUSAHAAN NAMA_VENDOR,
   a.TERMIN, 
   a.DIVISI_ID, 
   a.EST_PERIODE_BILLING, 
   a.EST_BULAN_BILLING, 
   a.EST_BILLING, 
   a.REAL_PERIODE_BILLING, 
   a.REAL_BULAN_BILLING, 
   a.REAL_BILLING,  
   a.KD_STATUS, 
   ms.URAIAN URAIAN_STATUS, 
   a.CREATED_BY 
FROM n2n.D_BILLING a
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID
LEFT JOIN n2n.D_PROJECT c ON
	b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m ON 
    m.VENDOR_ID = b.VENDOR_ID 
LEFT join n2n.M_STATUS ms on a.KD_STATUS = ms.KD_STATUS WHERE 
a.BILLING_ID = :billing_id;`

query.getDokumenInvoice = `SELECT 
   a.BILLING_DETAIL_ID, 
   a.BILLING_ID,
   b.DOKUMEN_ID,
   b.TIPE_DOKUMEN,
   b.JNS_DOKUMEN,
   b.NO_DOKUMEN,
   TO_CHAR(b.TGL_DOKUMEN, 'DD/MM/YYYY') AS "TGL_DOKUMEN",
   b.NOTES,
   b.VALUE_DOK,
   b.PROJECT_ID,
   CASE 
		WHEN b.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', b.URL_DOKUMEN)
		ELSE b.URL_DOKUMEN
	END URL_DOKUMEN  
FROM n2n.D_BILLING_DOKUMEN a 
join n2n.D_DOKUMEN b ON a.DOKUMEN_ID = b.DOKUMEN_ID and b.JNS_DOKUMEN = '01004' where 
a.BILLING_ID = :billing_id;`

query.getDokumenPenagihan = `SELECT 
   a.BILLING_DETAIL_ID, 
   a.BILLING_ID,
   b.DOKUMEN_ID,
   b.TIPE_DOKUMEN,
   b.JNS_DOKUMEN,
   b.NO_DOKUMEN,
   TO_CHAR(b.TGL_DOKUMEN, 'DD/MM/YYYY') AS "TGL_DOKUMEN",
   b.NOTES,
   b.VALUE_DOK,
   b.PROJECT_ID,
   CASE 
		WHEN b.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', b.URL_DOKUMEN)
		ELSE b.URL_DOKUMEN
	END URL_DOKUMEN 
FROM n2n.D_BILLING_DOKUMEN a 
join n2n.D_DOKUMEN b ON a.DOKUMEN_ID = b.DOKUMEN_ID and b.JNS_DOKUMEN = '01005' where 
a.BILLING_ID = :billing_id;`

query.countListBillingByTermin = `SELECT
   count(b.BILLING_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_PROJECT a right join n2n.D_BILLING b on a.PROJECT_ID = b.PROJECT_ID 
:condition`;

query.getListBillingByTermin = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.PROJECT_ID, 
   b.BILLING_ID, 
   a.PROJECT_NO, 
   a.PROJECT_NAME, 
   a.NILAI_KONTRAK, 
   b.TERMIN, 
   b.DIVISI_ID, 
   b.EST_PERIODE_BILLING, 
   b.EST_BULAN_BILLING, 
   b.EST_BILLING, 
   b.REAL_PERIODE_BILLING, 
   b.REAL_BULAN_BILLING, 
   b.REAL_BILLING,  
   b.KD_STATUS, 
   c.URAIAN URAIAN_STATUS, 
   b.CREATED_BY 
FROM n2n.D_PROJECT a
right join n2n.D_BILLING b ON a.PROJECT_ID = b.PROJECT_ID 
left join n2n.M_STATUS c on c.KD_STATUS = b.KD_STATUS 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.getListProjectForVendorProjectBilling = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.*,
   b.NO_KONTRAK,
   b.NILAI_KONTRAK,
   m.NAMA_PERUSAHAAN NAMA_VENDOR,
   c.PROJECT_NO,
   c.PROJECT_NAME,
   m1.PORTOFOLIO as "PORTOFOLIO_UR", 
   m2.UR_REF as "PROJECT_TYPE_UR",
   m3.URAIAN as "UR_STATUS"  
FROM n2n.D_BILLING a
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID
LEFT JOIN n2n.D_PROJECT c ON
	b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m 
    ON m.VENDOR_ID = b.VENDOR_ID 
LEFT JOIN n2n.M_PORTOFOLIO m1 
    ON m1.PORTOFOLIO_ID = c.PORTOFOLIO_ID 
LEFT JOIN n2n.M_REFERENSI m2 
    ON m2.KD_REF = c.PROJECT_TYPE_ID AND m2.JNS_REF = lower('PROJECT_TYPE_ID') 
LEFT JOIN n2n.M_STATUS m3 
    ON m3.KD_STATUS = a.KD_STATUS 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`
// -- join n2n.M_STATUS d on d.KD_STATUS = b.KD_STATUS

query.countListProjectForVendorProjectBilling = `SELECT
   count(a.CREATED_AT) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_BILLING a
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID
LEFT JOIN n2n.D_PROJECT c ON
	b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m ON m.VENDOR_ID = b.VENDOR_ID 
:condition`;

query.getDetailCostAdvance = `SELECT 
   a.COST_ID,
   c.COST_REVENUE_ID,
   a.PROJECT_ID,
   a.KATEGORI_COST,
   a.MATA_ANGGARAN,
   a.DIVISI_ID,
   a.JENIS_COST,
   a.NILAI_COST,
   a.TANGGAL_COST,
   a.NO_PR,
   a.NO_NODIN,
   a.STATUS,
   m1.UR_REF AS KATEGORI_COST_UR, 
   m2.UR_REF AS MATA_ANGGARAN_UR, 
   m3.UR_REF AS JENIS_COST_UR,
   b.PROJECT_NAME,
   b.PROJECT_NO,
   c.NILAI_REALISASI,
   c.AGING_CA,
   c.SATUAN_CA,
   c.NILAI_PELUNASAN,
   c.STATUS_INVOICE,
   c.STATUS_PELUNASAN   
FROM n2n.D_COST_OPR a 
JOIN n2n.D_COST_REVENUE c ON 
    a.COST_ID = c.COST_ID 
JOIN n2n.D_PROJECT b ON
	b.PROJECT_ID = a.PROJECT_ID
LEFT JOIN n2n.M_REFERENSI m1 ON
	m1.KD_REF = a.KATEGORI_COST AND m1.JNS_REF = lower('kategori_cost')
LEFT JOIN n2n.M_REFERENSI m2 ON 
	m2.KD_REF = a.MATA_ANGGARAN AND m2.JNS_REF = lower('mata_anggaran') 
LEFT JOIN n2n.M_REFERENSI m3 ON 
	m3.KD_REF = a.JENIS_COST AND m2.JNS_REF = lower('jenis_cost') 
WHERE c.COST_REVENUE_ID = :cost_revenue_id;`

query.getListProjectForCostAdvanced = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   a.COST_ID,
   c.COST_REVENUE_ID,
   a.PROJECT_ID,
   a.KATEGORI_COST,
   a.MATA_ANGGARAN,
   a.DIVISI_ID,
   a.JENIS_COST,
   a.NILAI_COST,
   TO_CHAR(a.TANGGAL_COST, 'DD/MM/YYYY') AS "TANGGAL_COST",
   a.NO_PR,
   a.NO_NODIN,
   a.STATUS,
   m1.UR_REF AS KATEGORI_COST_UR, 
   m2.UR_REF AS MATA_ANGGARAN_UR, 
   m3.UR_REF AS JENIS_COST_UR,
   b.PROJECT_NAME,
   b.PROJECT_NO,
   c.NILAI_REALISASI,
   c.AGING_CA,
   c.SATUAN_CA,
   c.NILAI_PELUNASAN,
   c.STATUS_INVOICE,
   c.STATUS_PELUNASAN   
FROM n2n.D_COST_OPR a 
JOIN n2n.D_COST_REVENUE c ON 
    a.COST_ID = c.COST_ID 
JOIN n2n.D_PROJECT b ON
	b.PROJECT_ID = a.PROJECT_ID
LEFT JOIN n2n.M_REFERENSI m1 ON
	m1.KD_REF = a.KATEGORI_COST AND m1.JNS_REF = lower('kategori_cost')
LEFT JOIN n2n.M_REFERENSI m2 ON 
	m2.KD_REF = a.MATA_ANGGARAN AND m2.JNS_REF = lower('mata_anggaran') 
LEFT JOIN n2n.M_REFERENSI m3 ON 
	m3.KD_REF = a.JENIS_COST AND m2.JNS_REF = lower('jenis_cost') 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.countListProjectForCostAdvanced = `SELECT 
   count(a.TANGGAL_COST) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_COST_OPR a 
JOIN n2n.D_COST_REVENUE c ON 
    a.COST_ID = c.COST_ID 
JOIN n2n.D_PROJECT b ON 
	b.PROJECT_ID = a.PROJECT_ID
LEFT JOIN n2n.M_REFERENSI m1 ON
	m1.KD_REF = a.KATEGORI_COST AND m1.JNS_REF = lower('kategori_cost')
LEFT JOIN n2n.M_REFERENSI m2 ON 
	m2.KD_REF = a.MATA_ANGGARAN AND m2.JNS_REF = lower('mata_anggaran') 
LEFT JOIN n2n.M_REFERENSI m3 ON 
	m3.KD_REF = a.JENIS_COST AND m2.JNS_REF = lower('jenis_cost') 
:condition`;

query.getDetailTagihanVendor = `SELECT 
   d.BILLING_REVENUE_ID,
   a.BILLING_ID,
   d.STATUS_PYMAD,
   d.NOMINAL_PYMAD,
   d.TANGGAL_BAST,
   d.NO_INVOICE,
   d.TANGGAL_INVOICE,
   d.STATUS_INVOICE,
   d.NOMINAL_INVOICE,
   d.NO_FAKTUR,
   d.TANGGAL_FAKTUR,
   d.STATUS_PELUNASAN,
   d.NOMINAL_PELUNASAN,
   d.TANGGAL_PELUNASAN,
   d.DENDA_PAJAK,
   d.PPH,
   b.NO_KONTRAK,
   b.NILAI_KONTRAK,
   m.NAMA_PERUSAHAAN NAMA_VENDOR,
   c.PROJECT_NO,
   c.PROJECT_NAME,
   b.PROJECT_VENDOR_ID   
FROM n2n.D_BILLING a 
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID 
JOIN n2n.D_BILLING_REVENUE d ON 
    d.BILLING_ID = a.BILLING_ID 
LEFT JOIN n2n.D_PROJECT c ON 
	b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m ON m.VENDOR_ID = b.VENDOR_ID 
WHERE d.BILLING_REVENUE_ID = :billing_revenue_id;`

query.getListProjectForTagihanVendor = `SELECT
   ROW_NUMBER() OVER (:order) AS row_number,
   d.BILLING_REVENUE_ID,
   a.BILLING_ID,
   d.STATUS_PYMAD,
   d.NOMINAL_PYMAD,
   TO_CHAR(d.TANGGAL_BAST, 'DD/MM/YYYY') TANGGAL_BAST,
   d.NO_INVOICE,
   TO_CHAR(d.TANGGAL_INVOICE, 'DD/MM/YYYY') TANGGAL_INVOICE,
   d.STATUS_INVOICE,
   d.NOMINAL_INVOICE,
   d.NO_FAKTUR,
   TO_CHAR(d.TANGGAL_FAKTUR, 'DD/MM/YYYY') TANGGAL_FAKTUR,
   d.STATUS_PELUNASAN,
   d.NOMINAL_PELUNASAN,
   TO_CHAR(d.TANGGAL_PELUNASAN, 'DD/MM/YYYY') TANGGAL_PELUNASAN,
   d.DENDA_PAJAK,
   d.PPH,
   b.NO_KONTRAK,
   b.NILAI_KONTRAK,
   m.NAMA_PERUSAHAAN NAMA_VENDOR,
   c.PROJECT_NO,
   c.PROJECT_NAME,
   b.PROJECT_VENDOR_ID   
FROM n2n.D_BILLING a 
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID 
JOIN n2n.D_BILLING_REVENUE d ON 
    d.BILLING_ID = a.BILLING_ID 
LEFT JOIN n2n.D_PROJECT c ON 
	b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m ON m.VENDOR_ID = b.VENDOR_ID 
:condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`
// LEFT JOIN n2n.D_BILLING_REVENUE d ON 

query.countListProjectForTagihanVendor = `SELECT
   count(a.CREATED_AT) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit" 
FROM n2n.D_BILLING a 
JOIN n2n.D_PROJECT_VENDOR b ON
	b.PROJECT_VENDOR_ID = a.PROJECT_ID
JOIN n2n.D_BILLING_REVENUE d ON 
    d.BILLING_ID = a.BILLING_ID 
LEFT JOIN n2n.D_PROJECT c ON
b.PROJECT_ID = c.PROJECT_ID 
LEFT JOIN n2n.M_VENDOR_PT m ON m.VENDOR_ID = b.VENDOR_ID 
:condition`;

query.getDetailProject = `SELECT
   a.*,
   0 as GROSS_MARGIN_PENAWARAN,
   0 as GROSS_MARGIN_KONTRAK,
   0 as NILAI_GROSS_MARGIN_PENAWARAN,
   0 as NILAI_GROSS_MARGIN_KONTRAK,
   b.UR_REF as "PROJECT_KATEGORI_UR",
   c.UR_REF as "PROJECT_TYPE_UR",
   d.PORTOFOLIO as "PORTOFOLIO_UR",
   e.UR_REF as "CATEGORY_UR",
   f.CUSTOMER_NAME,
   g.UR_REF as "UR_AREA",
   h.URAIAN as "UR_STATUS",
   (SELECT
        COUNT(x3.PROJECT_ID)
    FROM D_PROJECT x3
    WHERE x3.PROJECT_TYPE_ID = '2'
    AND x3.PROJECT_ACTUAL_ID = a.PROJECT_ID) AS "TOTAL_AKSELERASI",
   (SELECT TO_NUMBER(
        CASE
            WHEN
                    a.PROJECT_TYPE_ID = '1'
                AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') >= 1
                AND a.KD_STATUS in ('002','003')
                AND a.KD_ARCHIVE IS NULL
                AND (SELECT COUNT(x2.PROJECT_ID) FROM N2N.D_PROJECT x2 WHERE x2.PROJECT_ACTUAL_ID = a.PROJECT_ID AND x2.PROJECT_TYPE_ID = '2') = 0
                    THEN '1' --TO ACCELERATION
            ELSE '0'
        END) "TOTAL"
    FROM DUAL) AS "TO_AKSELERASI",
    (SELECT TO_NUMBER(
        CASE
            WHEN a.PROJECT_TYPE_ID = '1' AND a.KD_ARCHIVE IS NULL THEN '1' --TO ACCELERATION
            WHEN a.PROJECT_TYPE_ID = '2'
                 AND (SELECT COUNT(x1.PROJECT_ID) FROM N2N.D_DOKUMEN x1 WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.TIPE_DOKUMEN = '01') >= 1
                 AND a.KD_STATUS in ('002')
                 AND a.KD_ARCHIVE IS NULL
                THEN '1' --MARK AS
            ELSE '0'
        END) "TOTAL"
    FROM DUAL) AS "TO_MARK",
    CASE 
		WHEN	
			(SELECT
				1
			FROM N2N.D_PROJECT_STATUS x1
			WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.ID_TAB_STATUS = 'HK1' AND x1.KD_STATUS = '000') IS NOT NULL
			THEN 0
		ELSE 1
	END FLAG_VENDOR,
    y.DETAIL_VENDOR as VENDOR_PLANNING,
    z.DETAIL_VENDOR as VENDOR_FINAL,
    a.DOKUMEN_BAMK_ID  
FROM n2n.D_PROJECT a
LEFT JOIN n2n.M_REFERENSI b ON b.KD_REF = a.PROJECT_KATEGORI_ID AND b.JNS_REF = lower('PROJECT_KATEGORI_ID')
LEFT JOIN n2n.M_REFERENSI c ON c.KD_REF = a.PROJECT_TYPE_ID AND c.JNS_REF = lower('PROJECT_TYPE_ID')
LEFT JOIN n2n.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = a.PORTOFOLIO_ID
LEFT JOIN n2n.M_REFERENSI e ON e.KD_REF = a.CATEGORY_ID AND e.JNS_REF = lower('CATEGORY_ID')
LEFT JOIN n2n.M_CUSTOMER f ON f.CUSTOMER_ID = a.CUSTOMER_ID AND f.FLAG_AKTIF = 'Y'
LEFT JOIN n2n.M_REFERENSI g ON g.KD_REF = a.KD_AREA AND g.JNS_REF = lower('KD_AREA')
LEFT JOIN n2n.M_STATUS h ON h.KD_STATUS = a.KD_STATUS AND h.ID_TAB_STATUS = 'SA1' 
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'VENDOR_ID' VALUE a.VENDOR_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'T'
    GROUP BY a.PROJECT_ID) y ON y.PROJECT_ID = a.PROJECT_ID
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'VENDOR_ID' VALUE a.VENDOR_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'Y'
    GROUP BY a.PROJECT_ID) z ON z.PROJECT_ID = a.PROJECT_ID 
where
    a.PROJECT_ID = :project_id;`

query.getCBBPlanning = `SELECT
	a.*
FROM 
	N2N.D_PROJECT_CBB a
WHERE 
	a.PROJECT_ID = :project_id`

query.getCostPersonilPlanning = `SELECT 
	a.*,
	b.UR_REF AS UR_POSITION,
	c.UR_REF AS UR_KUALIFIKASI,
	d.UR_REF AS UR_SATUAN_PERSON,
	e.UR_REF AS UR_SATUAN_DATE
FROM
	N2N.D_PERSONIL a
LEFT JOIN N2N.M_REFERENSI b ON b.KD_REF = a.POSITION_ID  AND b.JNS_REF = 'position_id'
LEFT JOIN N2N.M_REFERENSI c ON c.KD_REF = a.KUALIFIKASI_ID  AND c.JNS_REF = 'kualifikasi_id'
LEFT JOIN N2N.M_REFERENSI d ON d.KD_REF = a.SATUAN_PERSON  AND d.JNS_REF = 'satuan_person'
LEFT JOIN N2N.M_REFERENSI e ON e.KD_REF = a.SATUAN_DATE  AND e.JNS_REF = 'satuan_date'
WHERE 
	a.PROJECT_ID = :project_id`

query.getBillingCollection = `
SELECT 
	a.*,
    CONCAT(CONCAT(a.EST_PERIODE_BILLING,'-'), a.EST_BULAN_BILLING) ESTIMATE_PERIODE_BILLING,
    (SELECT TO_NUMBER(
        CASE 
	    	WHEN a.KD_STATUS IS NULL THEN '1'
	    	ELSE '0'
	    END) "TOTAL"
    FROM DUAL) AS "FLAG_EDIT"    
FROM
	N2N.D_BILLING a
WHERE 
	a.PROJECT_ID = :project_id`

query.getVendorPlanning = `SELECT 
	a.*,
	b.NAMA_PERUSAHAAN AS UR_VENDOR,
    CASE 
		WHEN	
			(SELECT
				1
			FROM N2N.D_PROJECT_STATUS x1
			WHERE x1.PROJECT_ID = a.PROJECT_ID AND x1.ID_TAB_STATUS = 'HK1' AND x1.KD_STATUS = '000') IS NOT NULL
			THEN 0
		ELSE 1
	END flag_crud
FROM
	N2N.D_PROJECT_VENDOR a
LEFT JOIN N2N.M_VENDOR_PT b ON a.VENDOR_ID = b.VENDOR_ID
WHERE 
	a.PROJECT_ID = :project_id`

query.getDokumenProject = `SELECT 
	a.DOKUMEN_ID,
	a.TIPE_DOKUMEN ,
	a.JNS_DOKUMEN,
	b.UR_REF AS "URAIAN_JENIS",
	a.NO_DOKUMEN,
	a.TGL_DOKUMEN,
	CASE 
		WHEN a.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', a.URL_DOKUMEN)
		ELSE a.URL_DOKUMEN
	END URL_DOKUMEN,
	a.NOTES,
	a.VALUE_DOK,
	a.PROJECT_ID
FROM
	N2N.D_DOKUMEN a
LEFT JOIN N2N.M_REFERENSI b ON b.KD_REF = a.JNS_DOKUMEN 
WHERE 
	a.PROJECT_ID = :project_id
	AND 
	a.TIPE_DOKUMEN = :tipe_dokumen`

query.getSubReferensiByJenis = `SELECT
    a.KD_REF,
    a.UR_REF,
    a.JNS_REF,
    a.SUB_KD_REF,
    b.UR_REF,
    a.SUB_JNS_REF
FROM N2N.M_REFERENSI a
JOIN N2N.M_REFERENSI b ON b.JNS_REF = a.SUB_JNS_REF AND b.KD_REF = a.SUB_KD_REF AND b.FLAG_AKTIF = 'Y' AND b.JNS_REF = :jns_ref
WHERE
    a.SUB_KD_REF = :kd_ref
AND
    UPPER(a.UR_REF) like UPPER(:keyword)`

query.getAcl = `SELECT
    a.KD_REF,
    b.UR_REF,
    a.SUB_KD_REF as "ID_ACL"
FROM N2N.M_REFERENSI a
JOIN N2N.M_REFERENSI b ON b.KD_REF = a.KD_REF AND b.JNS_REF = 'ref_permissions'
WHERE
    a.JNS_REF = 'acl_has_permissions'
AND a.SUB_KD_REF = :id_acl
AND a.FLAG_AKTIF = 'Y'`

query.getListProjectVendor = `SELECT 
    ROW_NUMBER() OVER (:order) AS row_number,
    a.PROJECT_ID,
    a.PROJECT_NO,
    a.PROJECT_NAME,
    b.NILAI_KONTRAK as EST_HARGA_PEMENUHAN,
    b.DETAIL_VENDOR as DETAIL_VENDOR
FROM N2N.D_PROJECT a 
JOIN n2n.D_PROJECT_STATUS c ON c.PROJECT_ID = a.PROJECT_ID 
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'Y'
    OR (a.FLAG_FINAL = 'T'
        AND NOT EXISTS (SELECT
                            1
                        FROM N2N.D_PROJECT_VENDOR
                        WHERE FLAG_FINAL = 'Y' AND PROJECT_ID = a.PROJECT_ID))
    GROUP BY a.PROJECT_ID) b ON b.PROJECT_ID = a.PROJECT_ID  
WHERE
    a.KD_STATUS = '004' AND c.ID_TAB_STATUS = 'HK1' AND 
    (a.PROJECT_NO like :keyword
    OR upper(a.PROJECT_NAME) like upper(:keyword)
    OR upper(a.PROJECT_NO) like upper(:keyword)) 
    :condition 
:order
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.countListProjectVendor = `SELECT
   count(a.PROJECT_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit"
FROM N2N.D_PROJECT a
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'Y'
    OR (a.FLAG_FINAL = 'T'
        AND NOT EXISTS (SELECT
                            1
                        FROM N2N.D_PROJECT_VENDOR
                        WHERE FLAG_FINAL = 'Y' AND PROJECT_ID = a.PROJECT_ID))
    GROUP BY a.PROJECT_ID) b ON b.PROJECT_ID = a.PROJECT_ID
WHERE
    a.KD_STATUS = '004' AND 
    (a.PROJECT_NO like :keyword
    OR upper(a.PROJECT_NAME) like upper(:keyword)
    OR upper(a.PROJECT_NO) like upper(:keyword))`;

query.getDetailProjectVendor = `--DETAIL PROJECT VENDOR--
SELECT
    a.PROJECT_ID,
    a.PROJECT_NO,
    a.PROJECT_NAME,
    CASE
        WHEN c.PROJECT_ID is NULL THEN b.NILAI_KONTRAK
        ELSE c.NILAI_KONTRAK
    END EST_HARGA_PEMENUHAN,
    a.CONTRACT_START,
    a.CONTRACT_END,
    b.DETAIL_VENDOR as VENDOR_PLANNING,
    c.DETAIL_VENDOR as VENDOR_FINAL,
    a.DOKUMEN_BAMK_ID 
FROM N2N.D_PROJECT a
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'T'
    GROUP BY a.PROJECT_ID) b ON b.PROJECT_ID = a.PROJECT_ID
LEFT JOIN (
    SELECT
        a.PROJECT_ID,
        SUM(a.NILAI_KONTRAK) AS NILAI_KONTRAK,
        JSON_ARRAYAGG(
            JSON_OBJECT('PROJECT_VENDOR_ID' VALUE a.PROJECT_VENDOR_ID,
                        'PROJECT_ID' VALUE a.PROJECT_ID,
                        'VENDOR_ID' VALUE a.VENDOR_ID,
                        'NAMA_VENDOR' VALUE b.NAMA_PERUSAHAAN,
                        'NILAI_KONTRAK' VALUE a.NILAI_KONTRAK,
                        'NO_KONTRAK' VALUE a.NO_KONTRAK,
                        'JUDUL_KONTRAK' VALUE a.JUDUL_KONTRAK,
                        'START_DATE' VALUE TO_CHAR(a.START_DATE, 'YYYY-MM-DD'),
                        'END_DATE' VALUE TO_CHAR(a.END_DATE, 'YYYY-MM-DD'),
                        'HARGA_NEGOSIASI' VALUE a.NILAI_KONTRAK)) DETAIL_VENDOR
    FROM N2N.D_PROJECT_VENDOR a
    LEFT JOIN N2N.M_VENDOR_PT b ON b.VENDOR_ID = a.VENDOR_ID
    WHERE
        a.FLAG_FINAL = 'Y'
    GROUP BY a.PROJECT_ID) c ON c.PROJECT_ID = a.PROJECT_ID
WHERE
    a.PROJECT_ID = :project_id;`

query.getProjectByType = `SELECT
    a.PROJECT_ID,
    a.PROJECT_ACTUAL_ID,
    a.PROJECT_NO,
    a.PROJECT_NAME,
    a.CUSTOMER_ID,
    b.CUSTOMER_NAME,
    a.PORTOFOLIO_ID,
    c.PORTOFOLIO,
    a.PROJECT_TYPE_ID,
    d.UR_REF as PROJECT_TYPE_NAME,
    CASE WHEN :type = 1 THEN '004' ELSE '003' END AS KD_STATUS 
FROM N2N.D_PROJECT a
LEFT JOIN N2N.M_CUSTOMER b ON b.CUSTOMER_ID = a.CUSTOMER_ID
LEFT JOIN N2N.M_PORTOFOLIO c ON c.PORTOFOLIO_ID = a.PORTOFOLIO_ID
LEFT JOIN N2N.M_REFERENSI d ON d.KD_REF = a.PROJECT_TYPE_ID AND d.JNS_REF = 'project_type_id'
WHERE
    a.PROJECT_TYPE_ID = :type
AND
    a.KD_ARCHIVE is NULL
AND
    (upper(a.PROJECT_NO) like upper(:keyword) OR upper(a.PROJECT_NAME) like upper(:keyword))
AND
    a.PROJECT_ACTUAL_ID IS NULL
AND
    a.PROJECT_ID NOT IN
        (
            SELECT
                e.PROJECT_ID
            FROM N2N.D_PROJECT e
            INNER JOIN N2N.D_PROJECT f ON f.PROJECT_ACTUAL_ID = e.PROJECT_ID AND f.PROJECT_TYPE_ID = '2'
            WHERE e.PROJECT_TYPE_ID = '1'
        );`

query.getDataEkselerasi = `SELECT
    b.PROJECT_ID,
    b.PROJECT_NO,
    b.PROJECT_NAME,
    b.NILAI_PENAWARAN,
    b.PORTOFOLIO_ID,
    c.PORTOFOLIO,
    d.CUSTOMER_NAME,
    b.KD_AREA,
    e.UR_REF as NM_AREA,
    (SELECT
           JSON_ARRAYAGG(
               JSON_OBJECT('DOKUMEN_ID' VALUE a.DOKUMEN_ID,
                           'NO_DOKUMEN' VALUE a.NO_DOKUMEN,
                           'TIPE_DOKUMEN' VALUE a.TIPE_DOKUMEN,
                           'JNS_DOKUMEN' VALUE a.JNS_DOKUMEN,
                           'UR_TIPE_DOKUMEN' VALUE b.UR_REF,
                           'UR_JNS_DOKUMEN' VALUE c.UR_REF,
                           'URL_DOKUMEN' VALUE a.URL_DOKUMEN)
               ) as DOKUMEN
       FROM N2N.D_DOKUMEN a
       LEFT JOIN N2N.M_REFERENSI b ON b.KD_REF = a.JNS_DOKUMEN AND b.JNS_REF = 'jenis_dok'
       LEFT JOIN N2N.M_REFERENSI c ON c.KD_REF = a.TIPE_DOKUMEN AND c.JNS_REF = 'tipe_dok'
       WHERE
           a.PROJECT_ID = b.PROJECT_ID) AS DOKUMEN
FROM N2N.D_PROJECT a
LEFT JOIN N2N.D_PROJECT b ON b.PROJECT_ACTUAL_ID = a.PROJECT_ID
LEFT JOIN N2N.M_PORTOFOLIO c ON c.PORTOFOLIO_ID = b.PORTOFOLIO_ID
LEFT JOIN N2N.M_CUSTOMER d ON d.CUSTOMER_ID = b.CUSTOMER_ID
LEFT JOIN N2N.M_REFERENSI e ON e.KD_REF = b.KD_AREA AND e.JNS_REF = 'kd_area'
WHERE
    b.PROJECT_ACTUAL_ID = :project_id;`

query.getDetailVendorRealization = `SELECT 
	a.PROJECT_VENDOR_ID,
	a.PROJECT_ID,
	c.PROJECT_NO,
	c.PROJECT_NAME,
	a.VENDOR_ID,
	b.NAMA_PERUSAHAAN AS NAMA_VENDOR,
	a.NILAI_KONTRAK,
	a.NO_KONTRAK ,
	a.JUDUL_KONTRAK,
	TO_CHAR(a.START_DATE, 'YYYY-MM-DD') START_DATE,
	TO_CHAR(a.END_DATE, 'YYYY-MM-DD') END_DATE,
	a.FLAG_FINAL
FROM 	
	N2N.D_PROJECT_VENDOR a
LEFT JOIN N2N.M_VENDOR_PT b ON a.VENDOR_ID = b.VENDOR_ID  
LEFT JOIN N2N.D_PROJECT c ON a.PROJECT_ID = c.PROJECT_ID 
WHERE 
	a.PROJECT_VENDOR_ID = :project_vendor_id;`

query.getBillingRealization = ''
query.getBillingDocument = `
SELECT 
	a.DOKUMEN_ID,
	a.TIPE_DOKUMEN,
	a.JNS_DOKUMEN,
	c.UR_REF AS UR_JNS,
	a.NO_DOKUMEN,
	a.TGL_DOKUMEN,
	CASE 
		WHEN a.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', a.URL_DOKUMEN)
		ELSE a.URL_DOKUMEN
	END URL_DOKUMEN,
	a.NOTES,
	a.PROJECT_ID
FROM 
	N2N.D_DOKUMEN a
LEFT JOIN N2N.D_BILLING_DOKUMEN b ON b.DOKUMEN_ID = a.DOKUMEN_ID 
LEFT JOIN N2N.M_REFERENSI c ON c.KD_REF = a.JNS_DOKUMEN AND c.JNS_REF = 'jenis_dok'
WHERE 
	b.BILLING_ID = :billing_id;`

query.getBillingDocumentKeuangan = `
SELECT 
	a.DOKUMEN_ID,
	a.TIPE_DOKUMEN,
	a.JNS_DOKUMEN,
	c.UR_REF AS UR_JNS,
	a.NO_DOKUMEN,
	a.TGL_DOKUMEN,
	CASE 
		WHEN a.URL_DOKUMEN IS NOT NULL THEN CONCAT('https://api-hub.ilcs.co.id/api/v1/n2n/', a.URL_DOKUMEN)
		ELSE a.URL_DOKUMEN
	END URL_DOKUMEN,
	a.NOTES,
	a.PROJECT_ID
FROM 
	N2N.D_DOKUMEN a 
LEFT JOIN N2N.M_REFERENSI c ON c.KD_REF = a.JNS_DOKUMEN AND c.JNS_REF = 'jenis_dok'
WHERE 
	a.PROJECT_ID = :billing_id;`

query.getListBillingRevenue1 = `
SELECT abc.* 
    FROM (
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN e.NOMINAL_PELUNASAN 
            WHEN e.STATUS_INVOICE = 'T' THEN e.NOMINAL_INVOICE 
            ELSE '0' END 
        AS NOMINAL,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN to_char(e.TANGGAL_PELUNASAN,'DD/MM/YYYY') 
            WHEN e.STATUS_INVOICE = 'T' THEN to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') 
            ELSE '-' END 
        AS TANGGAL,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND (f.ID_TAB_STATUS = 'FN1' OR f.ID_TAB_STATUS = 'DL1') 
    WHERE 
        a.KD_STATUS IN ('301','400','401') AND (e.STATUS_INVOICE IS NULL OR e.STATUS_INVOICE = 'F') 
    ORDER BY a.CREATED_AT :order) a 
UNION ALL 
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        e.NOMINAL_INVOICE,
        to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') TANGGAL_INVOICE,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND (f.ID_TAB_STATUS = 'FN1' OR f.ID_TAB_STATUS = 'DL1')
    WHERE 
        a.KD_STATUS IN ('301','400','401') AND e.STATUS_INVOICE = 'T' AND (e.STATUS_PELUNASAN IS NULL OR e.STATUS_PELUNASAN = 'F') 
    ORDER BY a.CREATED_AT :order) b 
UNION ALL 
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        e.NOMINAL_INVOICE,
        to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') TANGGAL_INVOICE,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND (f.ID_TAB_STATUS = 'FN1' OR f.ID_TAB_STATUS = 'DL1')
    WHERE 
        a.KD_STATUS IN ('301','400','401') AND e.STATUS_PELUNASAN = 'T' 
    ORDER BY a.CREATED_AT :order) c
) abc :condition 
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.getListBillingRevenue2 = `
SELECT abc.* FROM (
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        e.NOMINAL_INVOICE,
        to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') TANGGAL_INVOICE,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND f.ID_TAB_STATUS = 'FN1'
    WHERE 
        a.KD_STATUS IN ('400','401') AND e.STATUS_PELUNASAN = 'T'  
    ORDER BY a.CREATED_AT :order) a
UNION ALL
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        e.NOMINAL_INVOICE,
        to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') TANGGAL_INVOICE,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND f.ID_TAB_STATUS = 'FN1'
    WHERE 
        a.KD_STATUS IN ('400','401') AND e.STATUS_INVOICE = 'T' AND (e.STATUS_PELUNASAN IS NULL OR e.STATUS_PELUNASAN = 'F')  
    ORDER BY a.CREATED_AT :order) b 
UNION ALL 
    SELECT * FROM (SELECT
        a.BILLING_ID,
        b.PROJECT_ID,
        b.PROJECT_NO,
        b.PROJECT_NAME,
        c.CUSTOMER_NAME,
        a.TERMIN,
        d.PORTOFOLIO,
        CASE 
            WHEN e.STATUS_PELUNASAN = 'T' THEN 'Pelunasan' 
            WHEN e.STATUS_INVOICE = 'T' THEN 'Invoice' 
            ELSE '-' END 
        AS STATUS,
        e.NOMINAL_INVOICE,
        to_char(e.TANGGAL_INVOICE,'DD/MM/YYYY') TANGGAL_INVOICE,
        CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
        f.URAIAN AS "URAIAN_STATUS",
        a.CREATED_AT,
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '301' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA1_END",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '402' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_START",
        (SELECT CASE WHEN DATE_STATUS IS NULL THEN NULL ELSE to_char(DATE_STATUS, 'YYYY-MM-DD') END FROM (SELECT DATE_STATUS FROM D_PROJECT_STATUS x1 WHERE x1.PROJECT_ID = a.BILLING_ID AND x1.KD_STATUS = '401' ORDER BY DATE_STATUS DESC) WHERE ROWNUM = 1) AS "SLA2_END" 
    FROM N2N.D_BILLING a
    JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
    JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
    JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
    LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
    LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND f.ID_TAB_STATUS = 'FN1'
    WHERE 
        a.KD_STATUS IN ('400','401') AND (e.STATUS_INVOICE IS NULL OR e.STATUS_INVOICE = 'F')  
    ORDER BY a.CREATED_AT :order) c
) abc :condition
OFFSET (:page - 1) * :limit ROWS -- Calculate offset
FETCH NEXT :limit ROWS ONLY;`

query.countListBillingRevenue = `
SELECT
   count(a.BILLING_ID) AS "total_data",
   :page AS "total_halaman",
   :limit AS "limit"
FROM n2n.D_BILLING a 
WHERE 
    a.KD_STATUS IN ('400','401')`

query.getDetailBillingRevenue = `
SELECT
    b.PROJECT_ID,
    b.PROJECT_NO,
    b.PROJECT_NAME,
    c.CUSTOMER_NAME,
    b.COGS,
    a.TERMIN,
    d.PORTOFOLIO,
    CONCAT(to_char(b.MARGIN_PRESENTASE),'%') AS "MARGIN_PRESENTASE",
    e.BILLING_REVENUE_ID,
    e.STATUS_PYMAD,
    e.NOMINAL_PYMAD,
    e.TANGGAL_BAST,
    e.NO_INVOICE,
    e.TANGGAL_INVOICE,
    e.STATUS_INVOICE,
    e.NOMINAL_INVOICE,
    e.NO_FAKTUR,
    e.TANGGAL_FAKTUR,
    e.STATUS_PELUNASAN,
    e.NOMINAL_PELUNASAN,
    e.TANGGAL_PELUNASAN,
    e.DENDA_PAJAK,
    e.PPH,
    e.NOMINAL_DPP,
    (SELECT KD_REF FROM N2N.M_REFERENSI mm WHERE mm.JNS_REF = 'tarif_ppn' AND SYSDATE BETWEEN mm.START_DATE AND mm.END_DATE) AS PPN,
    e.PPN_TARIF,
    e.WAPU,
    e.BIAYA_LAIN,
    e.OUTSTANDING,
    e.CREATED_BY,
    a.BILLING_ID,
    f.URAIAN AS "URAIAN_STATUS"
FROM N2N.D_BILLING a
JOIN N2N.D_PROJECT b ON b.PROJECT_ID = a.PROJECT_ID
JOIN N2N.M_CUSTOMER c ON c.CUSTOMER_ID = b.CUSTOMER_ID
JOIN N2N.M_PORTOFOLIO d ON d.PORTOFOLIO_ID = b.PORTOFOLIO_ID
LEFT JOIN N2N.D_BILLING_REVENUE e ON e.BILLING_ID = a.BILLING_ID
LEFT JOIN N2N.M_STATUS f ON f.KD_STATUS = a.KD_STATUS AND f.ID_TAB_STATUS = 'FN1'
WHERE
    a.BILLING_ID = :billing_id`

query.getDetailCustomer = `
SELECT
    a.* 
FROM N2N.M_CUSTOMER a 
WHERE
    a.CUSTOMER_ID = :customer_id`

query.getDetailContactCustomer = `
SELECT
    a.* 
FROM N2N.M_CUSTOMER_CONTACT a 
WHERE
    a.CUSTOMER_ID = :customer_id`

query.getListCustomer = `
    SELECT
        a.* 
    FROM N2N.M_CUSTOMER a 
    WHERE 
        a.FLAG_AKTIF IN ('Y','T')
        AND
        (upper(a.CUSTOMER_NAME) like upper(:keyword)
        OR upper(a.NPWP) like upper(:keyword)
        OR upper(a.ADDRESS) like upper(:keyword)
        OR upper(a.EMAIL) like upper(:keyword)
        OR upper(a.FAX) like upper(:keyword)
        OR upper(a.TELP) like upper(:keyword)
        OR upper(a.DESCRIPTION) like upper(:keyword)
        )
    ORDER BY a.CREATED_AT :order
    OFFSET (:page - 1) * :limit ROWS -- Calculate offset
    FETCH NEXT :limit ROWS ONLY;`

query.getListReferensi = `
    SELECT
        a.* 
    FROM N2N.M_REFERENSI a 
    WHERE 
        a.FLAG_AKTIF IN ('Y','T')
        AND
        (upper(a.KD_REF) like upper(:keyword)
        OR upper(a.UR_REF) like upper(:keyword)
        OR upper(a.JNS_REF) like upper(:keyword)
        )
    ORDER BY a.CREATED_DATE :order
    OFFSET (:page - 1) * :limit ROWS -- Calculate offset
    FETCH NEXT :limit ROWS ONLY;`

query.countListCustomer = `
    SELECT
       count(a.CUSTOMER_ID) AS "total_data",
       :page AS "total_halaman",
       :limit AS "limit"
    FROM n2n.M_CUSTOMER a`

query.countListReferensi = `
    SELECT
       count(a.KD_REF) AS "total_data",
       :page AS "total_halaman",
       :limit AS "limit"
    FROM n2n.M_REFERENSI a`

query.projectNo = `SELECT N2N.GETPROJECTNO(':portofolio_id', ':customer_id') AS PROJECT_NO FROM DUAL;`
query.getStartDate = `SELECT TO_CHAR(MIN(:column), 'YYYY-MM-DD') AS "START_DATE" FROM :table;`

module.exports = query
