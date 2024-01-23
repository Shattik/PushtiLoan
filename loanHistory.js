const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {

    const { farmer_id, page } = req.body;
    
    try {
        let size = await supabase.any(`SELECT count(*) FROM "FarmerLoan" WHERE "farmerId" = $1 AND "status" != $2`, [farmer_id, "ongoing"]);
        let data = await supabase.any(`SELECT "id", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "FarmerLoan" WHERE "farmerId" = $1 AND "status" != $2 order by "id" limit 50 offset $3`, [farmer_id, "ongoing" ,page*50]);
        let ongoing = await supabase.any(`SELECT "id", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "FarmerLoan" WHERE "farmerId" = $1 AND "status" = $2`, [farmer_id, "ongoing"]);
        const response = {
            size: size[0].count,
            data: data
        }
        if(ongoing.length > 0) {
            response.ongoing = ongoing[0];
        }
        else {
            response.ongoing = null;
        }
        res.json(response);
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }
});

router.route("/sme").post(async (req, res) => {

    const { sme_id, page } = req.body;
    
    try {
        let size = await supabase.any(`SELECT count(*) FROM "SmeLoan" WHERE "smeId" = $1 AND "status" != $2`, [sme_id, "ongoing"]);
        let data = await supabase.any(`SELECT "id", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "SmeLoan" WHERE "smeId" = $1 AND "status" != $2 order by "id" limit 50 offset $3`, [sme_id, "ongoing" ,page*50]);
        let ongoing = await supabase.any(`SELECT "id", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "SmeLoan" WHERE "smeId" = $1 AND "status" = $2`, [sme_id, "ongoing"]);
        const response = {
            size: size[0].count,
            data: data
        };
        if(ongoing.length > 0) {
            response.ongoing = ongoing[0];
        }
        else {
            response.ongoing = null;
        }
        res.json(response);
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }
});

module.exports = router;