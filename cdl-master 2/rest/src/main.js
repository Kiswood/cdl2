"use strict";
const { logger } = require('./logger.js');
var _ = require('lodash');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

var eventTrigger = async (req, res) => {
	let queryString = (req.query?.queryString || req.body?.queryString);
	logger.warn( `queryString from request: [${queryString}]`);
	let query = JSON.parse( queryString ?? "{ }" );
	logger.warn( `query = ${query}`);

	let result = await processEvent( { 'query' : query } ); //.then( result => 
	return result;
};

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const clientPromise = require('./mongo_connect.js');

const dbName = (process.env.DBNAME || "cdl");
const cdlName = "BofaClass";
const queriesCollection = "queries";
const RESULT_LIMIT = process.env.RESULT_LIMIT ?? 10;

let db;
var processEvent = async (event, context) => {
	try {
		logger.debug( `event = ${JSON.stringify( event )}` );
		const query = event.query;
			// ? JSON.parse(Buffer.from(event.query, "base64")) : null;
		const client = await clientPromise.catch(e => { logger.error(`Error on CONNECT: ${e}`); });

		// Use the client to return the name of the connected database.
		logger.debug( `parsed query = ${JSON.stringify(query)}` );
		db = client.db(dbName);
		logger.info(`${db.databaseName}`);
		let collection = db.collection(queriesCollection);
		logger.info(`${collection.collectionName}`);
		let promiseInsert = collection.insertOne( { "query" : JSON.stringify( query ) } );

		let cdlColl = db.collection( cdlName );
		let result = await cdlColl.find( query ).limit(10).toArray();
		return { "msg": result };
	} catch (e) {
		logger.error(`Error in processEvent: ${e}\n${e.stack}`);
		return e;
	}
	// return "No Event"; // invariant - should not get here
}

module.exports = {
	eventTrigger: eventTrigger,
	processEvent: processEvent
}
