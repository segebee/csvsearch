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
  console.log({ csvFolder });
  peopleFile.mv(fileName, function(err) {
    if (err) {
      console.log(err);
    }
  });

  // console.log("people file ", peopleFile);
  const stream = fs.createReadStream(fileName);
  // console.log({ stream });
  // var people = [];
  const csvStream = csv()
    .on("data", function(data) {
      if (!data[1]) return false;
      let fields = {};
      fields["name"] = data[1];
      fields["age"] = data[2];
      fields["address"] = data[3];
      fields["team"] = data[4];
      console.log({ fields });
      const person = new Person(fields);
      person.save(function(err) {
        if (err) console.log("error creating person", err);
        console.log("success creating person");
      });
    })
    .on("error", function(e) {
      console.log("errrrrrrr", e);
      return res.status(400).json({
        error: true,
        message: "An error occured parsing document"
      });
    })
    .on("end", function() {
      // console.log("people ", people);
      // if (people.length < 1) {
      //   return res.status(400).json({
      //     error: true,
      //     message: "Uploaded file does not match expected format"
      //   });
      // }

      // if (err)
      //   return res.status(400).json({
      //     error: true,
      //     message: "An error occured creating persons"
      //   });

      return res.json({
        success: true,
        message: "Data saved successfully"
      });
    });

  stream.pipe(csvStream);

  // csv
  //   .fromString(peopleFile.data.toString(), {
  //     headers: false,
  //     ignoreEmpty: true
  //   })
  //   .on("data", function(data) {
  //     if (!data[1]) return false;
  //     data["name"] = data[1];
  //     data["age"] = data[2];
  //     data["address"] = data[3];
  //     data["team"] = data[4];
  //     console.log({ data });
  //     people.push(data);
  //   })
  //   .on("error", function() {
  //     console.log("errrrrrrr");
  //     return res.status(400).json({
  //       error: true,
  //       message: "An error occured parsing document"
  //     });
  //   })
  //   .on("end", function() {
  //     console.log("people ", people);
  //     if (people.length < 1) {
  //       return res.status(400).json({
  //         error: true,
  //         message: "Uploaded file does not match expected format"
  //       });
  //     }

  //     Person.create(people, function(err, documents) {
  //       if (err)
  //         return res.status(400).json({
  //           error: true,
  //           message: "An error occured creating persons"
  //         });

  //       return res.json({
  //         success: true,
  //         message: "Data saved successfully"
  //       });
  //     });
  //   });
});

module.exports = router;
