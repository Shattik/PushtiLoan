const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {
    try {

        const { farmer_id, agent_id, min, max, description } = req.body;
        await supabase.any(`INSERT INTO "FarmerLoan" ("farmerId", "agentId", "requestedMin", "requestedMax", "description") VALUES ($1, $2, $3, $4, $5)`, [farmer_id, agent_id, min, max, description]);
        res.json("success: true");
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }
});

router.route("/sme").post(async (req, res) => {
    try {

        const { sme_id, agent_id, min, max, description } = req.body;
        await supabase.any(`INSERT INTO "SmeLoan" ("smeId", "agentId", "requestedMin", "requestedMax", "description") VALUES ($1, $2, $3, $4, $5)`, [sme_id, agent_id, min, max, description]);
        res.json("success: true");
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }
});

module.exports = router;