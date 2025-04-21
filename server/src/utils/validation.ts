import { DateTime } from "luxon";
import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const CreateUserSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is missing")
        .min(3, "First name is too short")
        .max(30, "First name is too long"),
    lastName: yup
        .string()
        .required("Last name is missing")
        .min(3, "Last name is too short")
        .max(30, "Last name is too long"),
    email: yup.string().email("Invalid Email").required("Email is missing"),
    // role: yup
    //     .string()
    //     .required("User role is missing")
    //     .oneOf(["user", "driver", "admin"], "Invalid user role"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    studentId: yup.number().required("ID is missing"),
});

export const CreateDriverSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is missing")
        .min(3, "First name is too short")
        .max(30, "First name is too long"),
    lastName: yup
        .string()
        .required("Last name is missing")
        .min(3, "Last name is too short")
        .max(30, "Last name is too long"),
    email: yup.string().email("Invalid Email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    studentId: yup.number().required("ID is missing"),
    licenseNumber: yup
        .number()
        .min(1000000000000000, "Invalid license number")
        .max(9999999999999999, "Invalid license number")
        .required("License number is missing"),
});

export const UpdateUserSchema = yup.object({
    firstName: yup
        .string()
        .min(3, "First name is too short")
        .max(30, "First name is too long")
        .required("First name is missing"),
    lastName: yup
        .string()
        .min(3, "Last name is too short")
        .max(30, "Last name is too long")
        .required("Last name is missing"),
    email: yup.string().email("Invalid Email").required("Email is missing"),
    role: yup.string().oneOf(["user", "driver", "admin"], "Invalid user role"),
    studentId: yup.number().required("ID is missing"),
    licenseNumber: yup.number(),
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

export const AdminDashboardSchema = yup.object({
    date: yup
        .string()
        .transform(function (value) {
            if (DateTime.fromFormat(value, "yyyy-MM-dd").isValid) {
                return value;
            }

            return "";
        })
        .required("Invalid date"),
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
    number: yup
        .number()
        .required("Shuttle number is missing")
        .min(1, "Shuttle number cant be negative"),
    driver: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid Driver ID"),
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
        .required("Invalid Route ID"),
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

export const CreateBookingSchema = yup.object({
    tripId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid Trip ID"),
});

export const UpdateShuttleLocationSchema = yup.object({
    shuttleId: yup
        .string()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            }
            return "";
        })
        .required("Invalid shuttle ID"),

    location: yup
        .array()
        .of(yup.number().required("Coordinates can only"))
        .length(2, "2 coordinates are required")
        .required("Coordinates are missing"),
});
