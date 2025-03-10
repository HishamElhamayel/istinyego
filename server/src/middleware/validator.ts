import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req, res, next): Promise<any> => {
    if (!req.body) return res.status(422).json({ error: "No body found" });

    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      await schemaToValidate.validate({
        body: req.body,
      });
      next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        res.status(422).json({ error: err.message });
      }
    }
  };
};
