const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {

    try {
        const {agent_id} = req.body;
        let data = await supabase.any(`SELECT "id", "farmerId", "requestedMin", "requestedMax", "description", "status", "requestTime" FROM "FarmerLoan" WHERE "agentId" = $1 AND ("status" = $2 OR "status" = $3 OR "status" = $4)` , [agent_id, "pending", "inspected", "interviewed"]);
        res.json(data); 
    }
    catch (err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }

});

router.route("/sme").post(async (req, res) => {

    try {
        const {agent_id} = req.body;
        let data = await supabase.any(`SELECT "id", "smeId", "requestedMin", "requestedMax", "description", "status", "requestTime" FROM "SmeLoan" WHERE "agentId" = $1 AND ("status" = $2 OR "status" = $3 OR "status" = $4)` , [agent_id, "pending", "inspected", "interviewed"]);
        res.json(data); 
    }
    catch (err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }
    
});

module.exports = router;