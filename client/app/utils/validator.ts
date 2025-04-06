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

export const AddBalanceSchema = yup.object({
    amount: yup
        .number()
        .required("Amount is missing")
        .min(30, "Amount must be above 30")
        .max(3000, "Amount must be below 3000"),
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
