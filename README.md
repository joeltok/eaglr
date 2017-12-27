# Eagle Id

Track flows through a distributed microservices architecture.

## How to install

```bash
npm install --save eaglr
```

## How to use

1. Append as middleware to server

```javascript
import Eaglr from 'eaglr'

app.use(Eaglr());
```

2. In business logic.

```javascript
import rp from 'request-promise';

var eaglrFlowId = req.headers['eaglr-token'];
rp({
  method: ...,
  headers: {
    ...,
    'eaglr-token': eagleFlowId
  }
})
```

3. Use your logger to record the eagle flow id at various parts of your application

```javascript
console.log(req.headers['eaglr-token'])
```
