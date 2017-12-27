import shortid from 'shortid';

export default (options) => {

  const header = options['header'] ? options['header'] : 'eaglr-flow-id';
  const prefix = options['prefix'] ? options['prefix'] : 'eaglr-';

  return (req, res, next) => {

    if (!req.headers[header]) {
      var eaglrHeader = prefix + shortid.generate();
      req.headers[header] = eaglrHeader;
      res.headers[header] = eaglrHeader;
    }

    next()

  }

}
