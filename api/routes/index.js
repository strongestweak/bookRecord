var express = require("express");
var router = express.Router();
const { Location } = require("../models");

/* GET home page. */
router.post("/create-locations", async function (req, res, next) {
  const { locations, isPath } = req.body;
  if (!locations || locations.constructor.name !== "Array") {
    throw {
      status: 400,
      message: "Bad request",
    };
  }

  try {
    let lastLocationObj;
    const locationsObj = [];
    for (let x = 0; x < locations.length; x++) {
      let isPathVal = isPath;
      if (x !== locations.length - 1) {
        isPathVal = true;
      }
      const location = locations[x];
      const locationObj = await Location.createIfNotExist({
        name: location.trim(),
        ParentId: lastLocationObj?.id || null,
        isPath: isPathVal,
      });
      locationsObj.push(locationObj);
      lastLocationObj = locationObj;
    }
    res.json(locationsObj);
  } catch (err) {
    console.log(err.message);
    throw {
      status: 501,
      message: err.message,
    };
  }
});

router.get("/parent/:id", async (req, res) => {
  const vals = [];
  const location = await Location.findByPk(req.params.id, {
    include: "Parent",
  });
  let Parent = location.Parent;
  while (Parent) {
    vals.unshift(Parent);
    const location = await Location.findByPk(Parent.id, {
      include: "Parent",
    });
    Parent = location.Parent;
  }
  res.json(vals);
});

module.exports = router;
