import * as yup from "yup";

export const loginSchema = yup.object({
  email: fields.email,
  password: fields.password,
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
