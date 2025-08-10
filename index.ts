import morgan from 'morgan';

import { accessLogger } from './src/common/logger';
export * from './src/common/logger';
export * from './src/common/errors';
export * from './src/common/zod-validation';

export function autoLogExpressRequests(app: { use: (...args: any[]) => void }) {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => accessLogger.info(message.trim()),
      },
    })
  );
}
