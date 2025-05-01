import { DateTime } from "luxon";
import * as yup from "yup";

type ValidationResult<T> = {
    error?: string;
    values?: T;
};

const validate = async <T extends object>(
    schema: yup.Schema,
    value: T
): Promise<ValidationResult<T>> => {
    try {
        const data = await schema.validate(value);
        return { values: data };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return { error: error.message };
        } else {
            return { error: (error as any).message };
        }
    }
};

export default validate;

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
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    confirmPassword: yup
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
    confirmPassword: yup
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
        .min(1000000000000000, "Invalid license number - too low")
        .max(9999999999999999, "Invalid license number - too high")
        .required("License number is missing"),
});

export const UpdateUserSchema = yup.object({
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
    studentId: yup.number().required("ID is missing"),
});

export const UserLoginSchema = yup.object({
    email: yup.string().required("Email is missing").email("Invalid Email"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
});

export const ChangePasswordSchema = yup.object({
    oldPassword: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    newPassword: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    confirmPassword: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short"),
});

export const AddBalanceSchema = yup.object({
    amount: yup
        .number()
        .required("Amount is missing")
        .min(30, "Amount must be above 30")
        .max(99999, "Amount must be below 99999"),
    cardNumber: yup
        .string()
        .required("Card number is missing")
        .min(16, "Card number is invalid"),
    cvv: yup
        .string()
        .required("CVV is missing")
        .min(3, "CVV is invalid")
        .max(4, "CVV is invalid"),
    expiryDate: yup
        .date()
        .required("Expiry date is missing")
        .min(DateTime.now().plus({ weeks: 1 }), "Expiry date is invalid"),
});

export const ForgotPasswordSchema = yup.object({
    email: yup.string().required("Email is missing").email("Invalid Email"),
});

export const CreateRouteSchema = yup.object({
    startLocation: yup.object({
        coordinates: yup
            .array()
            .of(yup.number().required("Coordinates can only be numbers"))
            .length(2, "2 coordinates are required")
            .required("Start location coordinates are missing"),
        address: yup
            .string()
            .trim()
            .required("Start location address is required"),
        description: yup
            .string()
            .trim()
            .required("Start location description is required"),
    }),
    endLocation: yup.object({
        coordinates: yup
            .array()
            .of(yup.number().required("Coordinates can only be numbers"))
            .length(2, "2 coordinates are required")
            .required("End location coordinates are missing"),
        address: yup
            .string()
            .trim()
            .required("End location address is required"),
        description: yup
            .string()
            .trim()
            .required("End location description is required"),
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
    driver: yup.string().required("Invalid Driver ID"),
});

export const CreateTripSchema = yup.object({
    shuttleId: yup.string().required("Invalid shuttle ID"),
    routeId: yup.string().required("Invalid Route ID"),
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
    duplicate: yup.number().min(0, "Invalid duplicate"),
});
