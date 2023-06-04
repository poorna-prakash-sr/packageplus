import express, { Request, Response, Router } from 'express';
import Npm from '../utils/npmjs';
import logger from '../utils/logger';
import { StatusCodes } from 'http-status-codes';

import ErrorMessage from '../types/error/messages';
import { ErrorCode } from '../types/error/error';
import { SuccessCode } from '../types/codes/success';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const queryname = req.query.name;
    const getresult = await Npm.getPackageInfo(`${queryname}`);
    return res
      .status(StatusCodes.OK)
      .json({ code: SuccessCode.AnalysisSuccess, message: getresult });
  } catch (err: any) {
    logger.error('[getnpmanalysis]', err.message);
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      code: ErrorCode.NpmApiError,
      message: ErrorMessage.NpmApiError,
    });
  }
});

export default router;
