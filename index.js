/*eslint no-undef: "error"*/
/*eslint-env node*/

var shortid = require('shortid');

module.exports = (options) => {

	const header = options && options['header'] ? options['header'] : 'eaglr-token';
	const prefix = options && options['prefix'] ? options['prefix'] : 'eaglr-';

	return (req, res, next) => {

		if (!req.headers[header]) {
			var eaglrHeader = prefix + shortid.generate();
			req.headers[header] = eaglrHeader;
			res.set(header, eaglrHeader);
		}

		next();

	};

};
