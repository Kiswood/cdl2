var express = require('express');
var main = require('../main');
var router = express.Router();
const { logger } = require('../logger.js');

/* GET docs listing. */
router.get('/', function(req, res, next) {
  res.send(`looking for all docs (limited to first 100)\n${req.params}`);
});

router.get('/:key/:value', function(req, res, next) {
  logger.warn( `req.params=[${JSON.stringify(req.headers)}]\nres.params=[${res.headers}]` );
  let query = { query : { [req.params['key']] : req.params['value'] } };
  logger.warn( `query object from req.params = ${JSON.stringify(query)}`);
  main.processEvent( query, req.params).then( result => { 
      logger.warn( `response from processEvent: length=${result.msg.length}\n\t${ JSON.stringify( result, indent=2 )}` );
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
    }).finally( () =>	{
      logger.info( "Exiting express handler '/'" );
	});
});

module.exports = router;
