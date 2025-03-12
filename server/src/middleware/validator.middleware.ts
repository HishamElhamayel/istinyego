import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: yup.ObjectSchema<any>): RequestHandler => {
    return async (req, res, next) => {
        if (!req.body) {
            res.status(422).json({ error: "No body found" });
            return;
        }

        try {
            await schema.validate(req.body);
            next();
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                res.status(422).json({ error: err.message });
            }
        }
    };
};
