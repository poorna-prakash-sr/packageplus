import server from './server';
import logger from './utils/logger';

const port = process.env.API_PORT || 3001;

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
