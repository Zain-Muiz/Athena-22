const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
var db = require("../models/dbconnect");
const path = require("path");

module.exports.register = (req, res) => {
  const {
    name,
    email,
    phNo,
    College,
    password,
    cnfrmpassword,
    branch,
    yearofStudy,
  } = req.body;
  phoneNum = parseInt(phNo);
  db.query(
    "SELECT * FROM users where email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("signup", {
          message: "Email Already Exists. Please Log In.",
        });
      } else if (password !== cnfrmpassword) {
        return res.render("signup", {
          message: "Entered passwords do not match. Try again",
        });
      }

      let hashedPass = await bcrypt.hash(password, 8);
      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          email: email,
          phNo: phoneNum,
          college: College,
          password: hashedPass,
          studyYear: yearofStudy,
          studyBranch: branch,
        },
        (error, reusult) => {
          if (error) {
            console.log(error);
          } else {
            req.session.email = email;
            req.session.name = name;
            req.session.contact = phNo;
            const token = jwt.sign({ email, name }, process.env.jwtsign, {
              expiresIn: "7d",
            });
            res.status(200).send(token);
          }
        }
      );
    }
  );
};

module.exports.verifyregisterotp = (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.body.otp == req.session.genotp) {
      db.query(
        "UPDATE users SET ? WHERE email = ?",
        [{ isVerified: "1" }, req.session.email],
        (error, reusult) => {
          if (error) {
            console.log(error);
          } else {
            req.session.verifieduser = "1";
            res.redirect("/userdashboard");
          }
        }
      );
    } else {
      console.log("false otp");
      res.status(403).send({
        message: `Invalid OTP.`,
      });
    }
  });
};

module.exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    req.session.email = email;

    if (!email || !password) {
      return res.status(400).send({
        message: "No fields can be empty",
      });
    }
    db.query(
      "SELECT * FROM users where email = ?",
      [email],
      async (error, results) => {
        if (results.length === 0) {
          return res.status(401).send({
            message: "Invalid Login Credentials.",
          });
        }
        if (error) {
          console.log(error);
        } else if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          return res.status(401).send({
            message: "Invalid Login Credentials.",
          });
        } else {
          const name = results[0].name;
          req.session.name = results[0].name;
          req.session.contact = results[0].phNo;
          req.session.verifieduser = results[0].isVerified;
          const token = jwt.sign({ email, name }, process.env.jwtsign, {
            expiresIn: "7d",
          });
          if (results[0].isVerified == "1") res.redirect("/userdashboard");
          else res.redirect("/auth/verifymail");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
