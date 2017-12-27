# Eagle Id

Track flows through a distributed microservices architecture.

## How to install

```bash
npm install --save eagleid
```

## How to use

1. Append as middleware to server

```javascript
import EagleId from 'eagleid'

app.use(EagleId());
```

2. In business logic.

```javascript
import rp from 'request-promise';

var eagleFlowId = req.headers['eagle-flow-id'];
rp({
  method: ...,
  headers: {
    ...,
    'eagle-flow-id': eagleFlowId
  }
})
```

3. Use your logger to record the eagle flow id at various parts of your application

```javascript
console.log(req.headers['eagle-flow-id'])
```

## Description
