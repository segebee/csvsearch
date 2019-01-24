const express = require("express");
const router = express.Router();
const Person = require("../models/Person");

/* search persons in db */
router.post("/", function(req, res, next) {
  const query = req.body.query;
  if (!query) {
    return res.json({
      error: true,
      message: "No keyword supplied"
    });
  }

  Person.find(
    { name: new RegExp(query, "i") },
    { _id: 0, id: 1, name: 1, age: 1, address: 1, team: 1 }
  )
    .limit(20)
    .exec((err, data) => {
      if (err)
        return res.json({
          error: true,
          message: "An error occured searching for a person"
        });
      return res.json({ results: data });
    });
});

module.exports = router;
