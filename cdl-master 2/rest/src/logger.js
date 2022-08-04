const winston = require('winston');

module.exports.logger = winston.createLogger({
  level: (process.env.LOGLEVEL || 'debug' ),
  format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
  transports: [
    //
	new winston.transports.Console({ format: winston.format.simple(), })
    //
  ],
});

exports.logger.log( exports.logger.level, `Logging set to ${exports.logger.level}. Use env.LOGLEVEL to change default.` );
