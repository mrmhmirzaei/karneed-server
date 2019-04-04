module.exports = (permissions=[])=>{
    return async(req,res,next)=>{
        if(await permissions.includes(req.permission) == true){
            next()
        } else{
            res.status(403);
            res.json({ status : false , code : 403 , message : 'شما حق دسترسی را ندارید.' })
        }
    }
}