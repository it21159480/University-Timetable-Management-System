// middleware/roleCheck.js
const roleCheck = (allowedRoles) =>  (req, res, next) => {
    // Assuming that the authentication middleware has already
    // set req.user to the authenticated user object
    // if (!req.user) {
    //   return res.status(401).send('Access Denied: No credentials sent!');
    // }

    // const { role } = req.user;
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send({message:'Access Denied: You do not have the correct permission.'});
    }
    next();
  };


module.exports = roleCheck;
