import express, { Request, Response, Router } from 'express';
import Npm from '../utils/npmjs';
import logger from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ErrorMessage from '../types/error/messages';
import { ErrorCode } from '../types/error/error';
import { SuccessCode } from '../types/codes/success';
import { has } from 'lodash';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const b = req.body;
  const schema = Joi.object().keys({
    dependencies: Joi.string(),
    packages: Joi.array().items(Joi.string().required()).optional(),
  });
  const validation = schema.validate(b);
  if (validation.error) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
      code: ErrorCode.InvalidInput,
      message: ErrorMessage.InvalidInput,
    });
  }
  try {
    let getresult = null;
    if (has(b, 'packages') && b.packages.length > 0) {
      getresult = await Promise.all(
        b.packages.map((pkg: string) => Npm.getPackageInfo(pkg))
      );
    } else {
      const currentpackage = JSON.parse(b.dependencies);
      const pakages = Object.keys(currentpackage);
      getresult = await Promise.all(
        pakages.map((pkg: string) => Npm.getPackageInfo(pkg))
      );
    }
    return res
      .status(StatusCodes.OK)
      .json({ code: SuccessCode.AnalysisSuccess, data: getresult });
  } catch (err: any) {
    logger.error('[getnpmanalysis]', err.message);
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      code: ErrorCode.NpmApiError,
      message: ErrorMessage.NpmApiError,
    });
  }
});

export default router;
