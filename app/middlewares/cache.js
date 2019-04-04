const cache = require('../services/cache');
module.exports = async(req,res,next)=>{
  if(await cache.exists(req.originalUrl)){
    res.json(await cache.get(req.originalUrl));
  } else {
    next();
  }
};
