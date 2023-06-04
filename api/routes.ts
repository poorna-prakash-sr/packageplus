import analysisRouter from './routes/analysis';

const init = (app: any) => {
  app.use('/analysis', analysisRouter);
};

export default { init };
