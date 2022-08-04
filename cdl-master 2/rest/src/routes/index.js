var express = require('express');

const { ServerResponse } = require('http');

const { logger } = require('../logger.js');
var main = require( '../main' )

var router = express.Router();

router.get('/', async function (req, res, next) {
  main.eventTrigger(req).then( result => { 
    logger.warn( `response from eventTrigger: length=${result.msg.length}\n\t${ JSON.stringify( result, indent=2 )}` );
    if (typeof result == "Error" || result.error || result.stack) {
      logger.warn( `Setting status 500` );
      res.status(500);
      res.render( 'error', result );
    } else {
      logger.info( `Setting status 200` );
      res.status(200);
      if( req.headers["content-type"] == "application/json" ) {
        res.json( result );
      } else {
        res.render( "index", result );
      }
    }
  }).catch( e => { 
    logger.error( `router.get got exception: \n${e})`); 
    next(e); 
  }).finally( () => { logger.info("main.eventTrigger returned"); });
	// } catch( e ) {
	// 	logger.error( "Passing error to express." );
	// 	next(e);
	// } finally {
	// 	logger.info( "Exiting express handler '/'" );
	// }
});

module.exports = router;
