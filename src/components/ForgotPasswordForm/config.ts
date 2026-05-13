import * as yup from "yup";

export const emailSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email address"),
});

export type EmailFormValues = yup.InferType<typeof emailSchema>;

export const otpSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email address"),

  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type OtpFormValues = yup.InferType<typeof otpSchema>;

export const resetSchema = yup.object({
  resetToken: yup.string().required("Reset token is required"),
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export type ResetFormValues = yup.InferType<typeof resetSchema>;
