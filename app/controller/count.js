const category = require('../database/category.sub'),
    job = require('../database/job'),
    expert = require('../database/expert');

async function init(req,res){
    let categories = await category.find().count().exec(),
        jobs = await job.find().count().exec(),
        experts = await expert.find().count().exec();

    res.json({ 
        status : true,
        data : { categories, jobs, experts }
    });
}

module.exports = { init };