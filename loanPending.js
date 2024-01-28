const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {
  try {
    const { agent_id } = req.body;
    console.log(agent_id);
    let data = await supabase.any(
      `select "request_id", "requestedMin", "requestedMax", "description", "requestTime", "status", "rank", "points", "farmerType", "name" as farmerName, "avatarLink", "phone"\ 
        from\
        (select\
          "request_id", "farmerId", "requestedMin", "requestedMax", "requestTime", "status", "description", "rank", "points", "farmerType"\
        from\
          (\
            select\
              "id" as request_id,\
              "agentId",\
              "farmerId",\
              "requestedMin",\
              "requestedMax",\
              "requestTime",\
              "description",\
              "status"\
            from\
              "FarmerLoan"\
            where\
              "agentId" = $1 and ("status" = 'pending' or "status" = 'inspected' or "status" = 'interviewed')\
              order by "requestTime" desc\
          ) as A\
          cross join (\
            select\
              "id",\
              "rank",\
              "points",\
              "farmerType"\
            from\
              "Farmer"\
          ) as B\
        where\
          b."id" = A."farmerId") as C\
          cross join\
          (select "id", "name", "avatarLink", "phone" from "User") as D\
          where d."id" = c."farmerId";`,
      [agent_id]
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    const response = {
      error: "Error: Internal server error",
    };
    res.status(400).json(response);
  }
});

router.route("/sme").post(async (req, res) => {
  try {
    const { agent_id } = req.body;
    let data = await supabase.any(
      `select "request_id", "requestedMin", "requestedMax", "requestTime", "description", "status", "rank", "points", "name" as smeName, "avatarLink", "phone"\ 
      from\
      (select\
        "request_id", "smeId", "requestedMin", "requestedMax", "description", "requestTime", "status", "rank", "points"\
      from\
        (\
          select\
            "id" as request_id,\
            "agentId",\
            "smeId",\
            "requestedMin",\
            "requestedMax",\
            "requestTime",\
            "description",\
            "status"\
          from\
            "SmeLoan"\
          where\
            "agentId" = $1 and ("status" = 'pending' or "status" = 'inspected' or "status" = 'interviewed')\
            order by "requestTime" desc\
        ) as A\
        cross join (\
          select\
            "id",\
            "rank",\
            "points"\
          from\
            "Sme"\
        ) as B\
      where\
        b."id" = A."smeId") as C\
        cross join\
        (select "id", "name", "avatarLink", "phone" from "User") as D\
        where d."id" = c."smeId";`,
      [agent_id]
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    const response = {
      error: "Error: Internal server error",
    };
    res.status(400).json(response);
  }
});

module.exports = router;
