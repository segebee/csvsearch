const express = require("express");
const router = express.Router();
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const Person = require("../models/Person");

router.post("/", function(req, res, next) {
  // check if file was uploaded
  if (!req.files)
    return res
      .status(400)
      .json({ error: true, message: "No files were uploaded." });
  // get uploaded csv
  const peopleFile = req.files.file;
  const csvFolder = path.resolve("./src/server/public/csvs/");
  const fileName = csvFolder + "/data.csv";
  // save uploaded file to disk
  peopleFile.mv(fileName, function(err) {
    if (err) {
      return res.status(400).json({
        error: true,
        message:
          "An error occured saving the document on the server for parsing"
      });
    }
    // parse uploaded CSV
    processCSV(fileName, res);
  });
});

// parse and save CSV data in the database
const processCSV = function(fileName, res) {
  const stream = fs.createReadStream(fileName);
  let people = [];
  const csvStream = csv()
    .on("data", function(data) {
      if (!data[1]) return false;
      let fields = {};
      fields["id"] = data[0];
      fields["name"] = data[1];
      fields["age"] = data[2];
      fields["address"] = data[3];
      fields["team"] = data[4];
      people.push(fields);
    })
    .on("error", function(e) {
      return res.status(400).json({
        error: true,
        message: "An error occured parsing document"
      });
    })
    .on("end", function() {
      if (people.length < 1) {
        return res.status(400).json({
          error: true,
          message:
            "Uploaded file has no records or does not match expected format"
        });
      }
      // insert processed data into the db
      try {
        Person.insertMany(people, function(err, docs) {
          if (err)
            return res.status(400).json({
              error: true,
              message: "An error occured creating persons"
            });

          return res.json({
            success: true,
            message: `${docs.length} records were successfully saved.`
          });
        });
      } catch (e) {
        console.log("Database error occured", e);
      }
    });
  // pipe csv file through fast csv
  stream.pipe(csvStream);
};

module.exports = router;
