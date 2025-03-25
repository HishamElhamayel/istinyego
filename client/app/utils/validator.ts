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
    studentId: yup.number().required("ID is missing"),
});
