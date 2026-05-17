import * as yup from "yup";

export const bioSchema = yup.object({
  bio: yup.string().max(1000, "Max 1000 characters"),
  education: yup.string().max(2000, "Max 2000 characters"),
});

export type BioFormValues = yup.InferType<typeof bioSchema>;
