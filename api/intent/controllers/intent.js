'use strict';

const { sanitizeEntity } = require('strapi-utils');
 const { NlpManager } = require('node-nlp');
 const manager = new NlpManager({ languages: ['en'], forceNER: true });

module.exports = {
train : async(req)=>{

var data = await strapi.services.intent.find()


// var result=data.map(entity => sanitizeEntity(entity, { model: strapi.models.intent }));

data.forEach(o=>{

//console.log("----"+JSON.stringify( o.user_query)+"userquery-----");
//console.log("------"+JSON.stringify( o.response)+"---------response");
o.user_query.forEach(d=>{manager.addDocument('en',`${d.query}`, `${o.action[0].Action}`);})
o.response.forEach(r=>{manager.addAnswer('en', `${o.action[0].Action}`, `${r.response}`)})
//console.log(`--${o.response[0].response}--`)
});
var trainRes =await manager.train();
manager.save();
   
console.log("-----------"+JSON.stringify(trainRes)+"-----------");
    return trainRes;
},
process: async(req)=>{
    
    manager.load('model.nlp');
    console.log(req.request.body.query);
    const q = req.request.body.query;
    const response = await manager.process('en', q);
    console.log(response);

return response
}



};
