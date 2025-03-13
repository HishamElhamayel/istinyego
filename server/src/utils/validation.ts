import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const CreateUserSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is missing")
        .min(3, "Name is too short")
        .max(30, "Name is too long"),
    lastName: yup
        .string()
        .required("Last name is missing")
        .min(3, "Name is too short")
        .max(30, "Name is too long"),
    email: yup.string().email("Invalid Email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    studentId: yup.number().required("Student ID is missing"),
});

export const TokenAndIdValidationSchema = yup.object({
    token: yup.string().trim().required("Token is missing"),
    userId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid User ID"),
});

export const UpdatePasswordSchema = yup.object({
    token: yup.string().trim().required("Token is missing"),
    userId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid User ID"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
});

export const SignInValidationSchema = yup.object({
    email: yup.string().email("Invalid Email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
});

export const TransactionSchema = yup.object({
    type: yup
        .string()
        .required("Transaction type is missing")
        .oneOf(["add", "deduct"], "Invalid transaction type"),
    amount: yup
        .number()
        .required("Amount is missing")
        .min(1, "Amount cant be negative"),
});
