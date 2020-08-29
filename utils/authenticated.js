const jwt = require("jsonwebtoken");
export const authenticated = (fn) => async (req, res) => {
  jwt.verify(req.cookies.authorization, process.env.SECRET, (err, decoded) => {
    if (!err && decoded) return await(req, res);
  });
};
