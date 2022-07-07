var jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    token = bearerToken;
    jwt.verify(token, process.env.jwtsign, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        req.jwtusername = decoded.username;
        req.jwtemail = decoded.email;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyJWT;
