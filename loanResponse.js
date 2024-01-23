const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer/next").post(async (req, res) => {

    try{
        const {loan_id} = req.body;
        let data = await supabase.any(`SELECT "next" FROM "LoanStages" WHERE "name" = (SELECT "status" FROM "FarmerLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4)`, [loan_id, "rejected", "ongoing", "interviewed"]);
        if (data.length == 0) {
            res.status(400).json("Error: Invalid loan id");
            return;
        }
        else{
            let next = data[0].next;
            await supabase.any(`UPDATE "FarmerLoan" SET "status" = $1 WHERE "id" = $2`, [next, loan_id]);
            res.status(200).json("success: true");
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }

});

router.route("/sme/next").post(async (req, res) => {

    try{
        const {loan_id} = req.body;
        let data = await supabase.any(`SELECT "next" FROM "LoanStages" WHERE "name" = (SELECT "status" FROM "SmeLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4)`, [loan_id, "rejected", "ongoing", "interviewed"]);
        if (data.length == 0) {
            res.status(400).json("Error: Invalid loan id");
            return;
        }
        else{
            let next = data[0].next;
            await supabase.any(`UPDATE "SmeLoan" SET "status" = $1 WHERE "id" = $2`, [next, loan_id]);
            res.status(200).json("success: true");
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).json("Error: Internal server error");
    }

});

module.exports = router;