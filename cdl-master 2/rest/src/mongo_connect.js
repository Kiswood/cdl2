const mongo = require("mongodb");
// process.env['ATLAS'] = "mongodb+srv://cdl:cdl@triggercluster.7x4ag.gcp.mongodb.net/?retryWrites=true&w=majority"
const uri = "mongodb://ibm_cloud_b6325d3c_01b1_49dc_9c93_de46006f9af5:e2d0bb66ef5dd1bb16367553ef9793e4fd043140952903f8e2f3b4d3aaa2f066@250d97d4-fef0-4627-9ddc-54e099bb6f8f-0.blrrvkdw0thh68l98t20.databases.appdomain.cloud:31023,250d97d4-fef0-4627-9ddc-54e099bb6f8f-1.blrrvkdw0thh68l98t20.databases.appdomain.cloud:31023,250d97d4-fef0-4627-9ddc-54e099bb6f8f-2.blrrvkdw0thh68l98t20.databases.appdomain.cloud:31023/ibmclouddb?authMechanism=SCRAM-SHA-256&authSource=admin&tls=true&tlsInsecure=true"
//const uri = (process.env.ATLAS || "mongodb+srv://cdl:cdl@cdlcluster.7x4ag.mongodb.net/?retryWrites=true&w=majority");
// const uri = (process.env.ATLAS || "mongodb+srv://cdl:cdl@cdl-sharded.7x4ag.mongodb.net/?retryWrites=true&w=majority");
console.log( `MongoDB: connecting to ${uri}`);
let client = new mongo.MongoClient(uri,
	{ useNewUrlParser: true, useUnifiedTopology: true });
const clientPromise = client.connect();

module.exports = clientPromise;
