const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {

    const { farmer_id, page } = req.body;

    console.log(farmer_id, page);
    
    try {
        let size = await supabase.any(`SELECT count(*) FROM "FarmerLoan" WHERE "farmerId" = $1 AND "status" != $2`, [farmer_id, "ongoing"]);
        let data = await supabase.any(`SELECT "id", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "FarmerLoan" WHERE "farmerId" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4 AND "status" != $5 order by "id" DESC limit 10 offset $6`, [farmer_id, "ongoing", "pending", "interviewed", "inspected" ,page*10]);
        let ongoing = await supabase.any(`SELECT "id", "requestedMin", "requestedMax", "approvedAmount", "remainingAmount", "status", "approvalTime", "requestTime", "approvalTime" FROM "FarmerLoan" WHERE "farmerId" = $1 AND ("status" = $2 OR "status" = $3 OR "status" = $4 OR "status" = $5)`, [farmer_id, "ongoing", "pending", "interviewed", "inspected"]);
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
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }
});

router.route("/sme").post(async (req, res) => {

    const { sme_id, page } = req.body;
    
    try {
        let size = await supabase.any(`SELECT count(*) FROM "SmeLoan" WHERE "smeId" = $1 AND "status" != $2`, [sme_id, "ongoing"]);
        let data = await supabase.any(`SELECT "id", "requestTime", "approvedAmount", "remainingAmount", "status", "approvalTime", "finishTime" FROM "SmeLoan" WHERE "smeId" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4 AND "status" != $5 order by "id" DESC limit 10 offset $6`, [sme_id, "ongoing", "pending", "interviewed", "inspected" ,page*10]);
        let ongoing = await supabase.any(`SELECT "id", "requestedMin", "requestedMax", "approvedAmount", "remainingAmount", "status", "approvalTime", "requestTime", "approvalTime" FROM "SmeLoan" WHERE "smeId" = $1 AND ("status" = $2 OR "status" = $3 OR "status" = $4 OR "status" = $5)`, [sme_id, "ongoing", "pending", "interviewed", "inspected"]);
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
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }
});

module.exports = router;