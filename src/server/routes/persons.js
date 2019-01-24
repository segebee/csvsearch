const express = require("express");
const router = express.Router();
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
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

/* return list of persons in db */
router.get("/search", function(req, res, next) {
  // console.log({ req });
  if (!req.query.keyword) {
    return res.json({
      error: true,
      message: "No keyword supplied"
    });
  }

  Person.find({ name: new RegExp(req.query.keyword, "i") })
    .limit(20)
    .exec((err, data) => {
      if (err)
        return res.json({
          error: true,
          message: "An error occured searching for a person"
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
  const peopleFile = req.files.file;
  const csvFolder = path.resolve("./src/server/public/csvs/");
  const fileName = csvFolder + "/data.csv";
  // console.log({ csvFolder });
  peopleFile.mv(fileName, function(err) {
    if (err) {
      return res.status(400).json({
        error: true,
        message:
          "An error occured saving the document on the server for parsing"
      });
    }

    processCSV(fileName, res);
  });
});

const processCSV = function(fileName, res) {
  const stream = fs.createReadStream(fileName);
  let people = [];

  const csvStream = csv()
    .on("data", function(data) {
      if (!data[1]) return false;
      let fields = {};
      fields["name"] = data[1];
      fields["age"] = data[2];
      fields["address"] = data[3];
      fields["team"] = data[4];
      people.push(fields);
      // console.log("fields", fields);
      console.log("people len", people.length);
    })
    .on("error", function(e) {
      return res.status(400).json({
        error: true,
        message: "An error occured parsing document"
      });
    })
    .on("end", function() {
      console.log("final people ", people.length);

      if (people.length < 1) {
        return res.status(400).json({
          error: true,
          message:
            "Uploaded file has no records or does not match expected format"
        });
      }
      // insert processed data into the db
      Person.insertMany(people, function(err, docs) {
        if (err) {
          console.log({ err });
          return res.status(400).json({
            error: true,
            message: "An error occured creating persons"
          });
        } else {
          return res.json({
            success: true,
            message: `${docs.length} records were successfully saved.`
          });
        }
      });
    });
  // pipe csv file through fast csv
  stream.pipe(csvStream);
};

module.exports = router;
