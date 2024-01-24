const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer/next").post(async (req, res) => {

    try{
        const {loan_id} = req.body;
        let data = await supabase.any(`SELECT "next" FROM "LoanStages" WHERE "name" = (SELECT "status" FROM "FarmerLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4 AND "status" != $5)`, [loan_id, "rejected", "ongoing", "interviewed", "completed"]);
        if (data.length == 0) {
            const response = {
                error: "Error: Invalid loan id"
            }
            res.status(400).json(response);
            return;
        }
        else{
            let next = data[0].next;
            await supabase.any(`UPDATE "FarmerLoan" SET "status" = $1 WHERE "id" = $2`, [next, loan_id]);
            const response = {
                success: true
            }
            res.status(200).json(response);
        }
    }
    catch(err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }

});

router.route("/sme/next").post(async (req, res) => {

    try{
        const {loan_id} = req.body;
        let data = await supabase.any(`SELECT "next" FROM "LoanStages" WHERE "name" = (SELECT "status" FROM "SmeLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4 AND "status" != $5)`, [loan_id, "rejected", "ongoing", "interviewed", "completed"]);
        if (data.length == 0) {
            const response = {
                error: "Error: Invalid loan id"
            }
            res.status(400).json(response);
            return;
        }
        else{
            let next = data[0].next;
            await supabase.any(`UPDATE "SmeLoan" SET "status" = $1 WHERE "id" = $2`, [next, loan_id]);
            const response = {
                success: true
            }
            res.status(200).json(response);
        }
    }
    catch(err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }

});

router.route("/farmer/reject").post(async (req, res) => {
    
        try{
            const {loan_id} = req.body;
            let data = await supabase.any(`SELECT "status" FROM "FarmerLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4`, [loan_id, "rejected", "ongoing", "completed"]);
            if (data.length == 0) {
                const response = {
                    error: "Error: Invalid loan id"
                }
                res.status(400).json(response);
            }
            else  {
                await supabase.any(`UPDATE "FarmerLoan" SET "status" = $1 WHERE "id" = $2`, ["rejected", loan_id]);
                const response = {
                    success: true
                }
                res.status(200).json(response);
            }
        }
        catch(err) {
            console.log(err);
            const response = {
                error: "Error: Internal server error"
            }
            res.status(400).json(response);
        }
    
});

router.route("/sme/reject").post(async (req, res) => {
    
    try{
        const {loan_id} = req.body;
        let data = await supabase.any(`SELECT "status" FROM "SmeLoan" WHERE "id" = $1 AND "status" != $2 AND "status" != $3 AND "status" != $4`, [loan_id, "rejected", "ongoing", "completed"]);
        if (data.length == 0) {
            const response = {
                error: "Error: Invalid loan id"
            }
            res.status(400).json(response);
        }
        else  {
            await supabase.any(`UPDATE "SmeLoan" SET "status" = $1 WHERE "id" = $2`, ["rejected", loan_id]);
            const response = {
                success: true
            }
            res.status(200).json(response);
        }
    }
    catch(err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }

});

router.route("/farmer/accept").post(async (req, res) => {

    try {
        const {loan_id, amount} = req.body;
        let data = await supabase.any(`SELECT "status" FROM "FarmerLoan" WHERE "id" = $1 AND "status" = $2`, [loan_id, "interviewed"]);
        if (data.length == 0) {
            const response = {
                error: "Error: Invalid loan id"
            }
            res.status(400).json(response);
        }
        else  {
            await supabase.any(`UPDATE "FarmerLoan" SET "status" = $1, "approvedAmount" = $2, "remainingAmount" = $3, "approvalTime" = now() WHERE "id" = $4`, ["ongoing", amount, amount, loan_id]);
            const response = {
                success: true
            }
            res.status(200).json(response);
        }
    }
    catch(err) {
        console.log(err);
        const response = {
            error: "Error: Internal server error"
        }
        res.status(400).json(response);
    }

});

router.route("/sme/accept").post(async (req, res) => {

    try {
        const {loan_id, amount} = req.body;
        let data = await supabase.any(`SELECT "status" FROM "SmeLoan" WHERE "id" = $1 AND "status" = $2`, [loan_id, "interviewed"]);
        if (data.length == 0) {
            const response = {
                error: "Error: Invalid loan id"
            }
            res.status(400).json(response);
        }
        else  {
            await supabase.any(`UPDATE "SmeLoan" SET "status" = $1, "approvedAmount" = $2, "remainingAmount" = $3, "approvalTime" = now() WHERE "id" = $4`, ["ongoing", amount, amount, loan_id]);
            const response = {
                success: true
            }
            res.status(200).json(response);
        }
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