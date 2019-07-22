const jwt = require("jsonwebtoken");
const settings = require("../settings");

let authorizationMiddleware = function(req, res, next){
    var token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        })
        return
    }
 
    token = token.replace('Bearer ', '')
 
    jwt.verify(token, settings.JWT_PASSWORD, function(err, test) {
        console.log(test);
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
          next();
      }
    })
}

module.exports = authorizationMiddleware;