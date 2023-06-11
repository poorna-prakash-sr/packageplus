import { pino } from 'pino';
import { Ilogger } from '../types/custom/logger';

const logger: Ilogger = {
  info: (...message: any) => {
    pino().info(JSON.stringify(message));
  },
  error: (...message: any) => {
    pino().error(JSON.stringify(message));
  },
};

export default logger;
