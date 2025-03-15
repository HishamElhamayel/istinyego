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
    // role: yup.string().required("User role is missing"),
    // .oneOf(["user", "driver", "admin"], "Invalid user role"),
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

export const CreateTransactionSchema = yup.object({
    type: yup
        .string()
        .required("Transaction type is missing")
        .oneOf(["add", "deduct"], "Invalid transaction type"),
    amount: yup
        .number()
        .required("Amount is missing")
        .min(1, "Amount cant be negative"),
});

export const CreateRouteSchema = yup.object({
    startLocation: yup.object({
        coordinates: yup
            .array()
            .of(yup.number().required("Coordinates can only be numbers"))
            .length(2, "2 coordinates are required")
            .required("Coordinates are missing"),
        address: yup.string().trim().required("Address is required"),
        description: yup.string().trim().required("Description is required"),
    }),
    endLocation: yup.object({
        coordinates: yup
            .array()
            .of(yup.number().required("Coordinates can only be numbers"))
            .length(2, "2 coordinates are required")
            .required("Coordinates are missing"),
        address: yup.string().trim().required("Address is required"),
        description: yup.string().trim().required("Description is required"),
    }),
    fare: yup
        .number()
        .required("Amount is missing")
        .min(1, "Amount cant be negative"),
});

export const CreateShuttleSchema = yup.object({
    capacity: yup
        .number()
        .required("Capacity is missing")
        .min(1, "Capacity cant be negative")
        .max(30, "Capacity cant be more than 30"),
    currentLocation: yup.object({
        coordinates: yup
            .array()
            .of(yup.number().required("Coordinates can only be numbers"))
            .length(2, "2 coordinates are required")
            .required("Coordinates are missing"),
    }),
    driver: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid User ID"),
});

export const CreateTripSchema = yup.object({
    shuttleId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid shuttle ID"),
    routeId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid User ID"),
    startTime: yup
        .date()
        .min(new Date(), "Start time cant be in the past")
        .required("Start time is missing"),
    endTime: yup
        .date()
        .min(new Date(), "End time cant be in the past")
        .required("End time is missing"),
    date: yup
        .string()
        .transform(function (value) {
            const date = new Date(value).setHours(0, 0, 0, 0);
            const todaysDate = new Date().setHours(0, 0, 0, 0);

            if (date.toString() !== "Invalid Date" && date >= todaysDate) {
                return value;
            }

            return "";
        })
        .required("Invalid date"),
    availableSeats: yup
        .number()
        .required("Available seats is missing")
        .min(1, "Available seats cant be 0 or negative")
        .max(30, "Available seats cant be more than 30"),
});
