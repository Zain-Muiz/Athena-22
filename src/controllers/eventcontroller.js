const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
var db = require("../models/dbconnect");
const path = require("path");
var dash = require("../src/server");

module.exports.registerevent = (req, res) => {
  const {
    numevents,
    event1,
    event2,
    event3,
    needpcbkit,
    isISTE,
    ISTEregno,
    couponcode1,
    couponcode2,
  } = req.body;
  req.session.regdetails = req.body;
  console.log(req.body);
  regtime = new Date().toLocaleString();

  db.query(
    "INSERT INTO registration SET ?",
    {
      name: req.session.name,
      email: req.session.email,
      eventName1: event1,
      eventName2: event2,
      eventName3: event3,
      needpcbkit: needpcbkit,
      isISTE: isISTE,
      ISTEregno: ISTEregno,
      couponcode1: couponcode1,
      couponcode2: couponcode2,
      phNo: req.session.contact,
      date_time: regtime,
    },
    (error, reusult) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/userdashboard/eventcheckout");
      }
    }
  );
};

module.exports.registerfandevent = (req, res) => {
  const { numevents, event1, event2, videolink, instaid } = req.body;
  req.session.regdetails = req.body;
  console.log(req.body);
  regtime = new Date().toLocaleString();

  db.query(
    "INSERT INTO fnd SET ?",
    {
      name: req.session.name,
      email: req.session.email,
      phNo: req.session.contact,
      video_link: videolink,
      insta_id: instaid,
      date_time: regtime,
    },
    (error, reusult) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/userdashboard/eventcheckout");
      }
    }
  );
};

module.exports.getevents = (req, res) => {
  db.query(
    "SELECT * FROM events where category = ?",
    [req.query.category],
    (err, results) => {
      if (err) console.log(err);
      else {
        res.status(200).send(results);
      }
    }
  );
};

// EACH EVENT PAGE RENDERING
module.exports.eachevent = (req, res) => {
  console.log(req.params.id);
  db.query(
    "SELECT * FROM events WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      else {
        console.log(results);
        res.status(200).send(results);
      }
    }
  );
};
