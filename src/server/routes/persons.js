var express = require("express");
var router = express.Router();
var csv = require("fast-csv");
const Person = require("../models/Person");

/* return list of persons in db */
router.get("/", function(req, res, next) {
  Person.find((err, data) => {
    if (err)
      return res.json({
        error: true,
        message: "An error occured fetching persons"
      });
    return res.json({ success: true, data: data });
  });
});

router.post("/create", function(req, res, next) {
  // check if file was uploaded
  // console.log("request ", req);

  if (!req.files)
    return res
      .status(400)
      .json({ error: true, message: "No files were uploaded." });

  // get uploaded csv
  // console.log("files ", req.files);
  var peopleFile = req.files.file;
  // console.log("people file ", peopleFile);
  var people = [];
  csv
    .fromString(peopleFile.data.toString(), {
      headers: false,
      ignoreEmpty: true
    })
    .on("data", function(data) {
      data["name"] = data[1];
      data["age"] = data[2];
      data["address"] = data[3];
      data["team"] = data[4];
      // console.log({ data });
      people.push(data);
    })
    .on("end", function() {
      console.log("people ", people);
      Person.create(people, function(err, documents) {
        if (err)
          return res.json({
            error: true,
            message: "An error occured creating persons"
          });

        return res.json({
          success: true,
          message: "Data saved successfully"
        });
      });
    });
});

module.exports = router;
