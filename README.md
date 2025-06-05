# common-loggers-pkg

Package which provides access to most commonly used logger instances.

---

## Loggers

### logger

Default logger. Logs errors to a file, everything else to console.

### kafkaLogger

Kafka events logger. Logs to a rotation file. File is rotated every 7 days or when 50MB size is reached.

### accessLogger

Incoming HTTP requests logger. Logs to a rotation file. File is rotated every 5 days or when 100MB size is reached.

## Other functions

### autoLogExpressRequests(app)

Calling this function will start automatic logging of incoming express HTTP requests. It uses the "accessLogger" logger.

---

## Imports

```ts
import {
  logger,
  kafkaLogger,
  accessLogger,
  autoLogExpressRequests
} from 'common-loggers-pkg';
```
