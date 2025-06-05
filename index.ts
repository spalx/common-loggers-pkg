import morgan from 'morgan';

import { accessLogger } from './src/common/logger';
export * from './src/common/logger';

export function autoLogExpressRequests(app) {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => accessLogger.info(message.trim()),
      },
    })
  );
}
