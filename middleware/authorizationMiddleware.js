const jwt = require("jsonwebtoken");
const settings = require("../settings");
const UserDao = require("../daos/userDao");

let authorization = function(req, res, next){
    let token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        })
        return
    }
 
    token = token.replace('Bearer ', '')
 
    jwt.verify(token, settings.JWT_PASSWORD, function(err, test) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
          next();
      }
    })
}

let isAdmin = function(req, res, next){
  let token = req.headers['authorization'];
  token = token.replace('Bearer ', '');

  let decoded = jwt.decode(token);
  let userDao = new UserDao();
  userDao.findById(decoded.id)
    .then((user) => {
      if(!user.isAdmin){
        res.status(401).send({
          error: "Usuario no admin"
        });
        
        return;
      }

      next();
    });
}

module.exports = {
  authorization: authorization,
  isAdmin: isAdmin
};