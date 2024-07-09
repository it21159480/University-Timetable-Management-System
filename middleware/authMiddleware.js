const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader  = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  jwt.verify(token, process.env.JWT_SECRET,(err,user) =>{
    if(err){
      return res.status(403).send({message :'Invalide or expired token'});
    }
    req.user = user;
    next();
  });
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (ex) {
  //   res.status(400).send('Invalid token.');
  // }
};

module.exports = auth;
