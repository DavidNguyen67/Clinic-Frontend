import * as yup from "yup";

export const feeSchema = yup.object({
  consultationFee: yup
    .number()
    .min(0, "Fee cannot be negative")
    .max(100_000_000, "Fee seems too high")
    .required("Consultation fee is required"),
});

export type FeeFormValues = yup.InferType<typeof feeSchema>;
