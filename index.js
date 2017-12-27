import shortid from 'shortid';

export default (options) => {

  const header = options['header'] ? options['header'] : 'eglr-flow-id';
  const prefix = options['prefix'] ? options['prefix'] : 'eglr-';

  return (req, res, next) => {

    if (!req.headers[header]) {
      var eagleHeader = prefix + shortid.generate();
      req.headers[header] = eagleHeader;
      res.headers[header] = eagleHeader;
    }

    next()

  }

}
