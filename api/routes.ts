import analysisRouter from './routes/analysis';

const init = (app: any) => {
  app.use('/api/analysis', analysisRouter);
};

export default { init };
