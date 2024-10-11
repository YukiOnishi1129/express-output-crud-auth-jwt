import { Response } from 'express';

type ResponseSuccessStatus = 200 | 201 | 204;

export const sendSuccess = <T>(
  res: Response,
  status: ResponseSuccessStatus,
  data: T | null = null,
) => {
  return res.status(status).send(data);
};

export const sendError = (
  res: Response,
  status: number,
  data: string[] | null = null,
) => {
  let errors: string[] | null = data;
  switch (status) {
    case 401:
      errors = ['Unauthorized'];
      break;
    case 403:
      errors = ['Forbidden'];
      break;
    case 404:
      errors = ['Not Found'];
      break;
    case 500:
      errors = ['Internal Server Error'];
      break;
    default:
  }
  return res.status(status).send({
    errors,
  });
};
