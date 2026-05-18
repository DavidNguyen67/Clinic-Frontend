import * as yup from "yup";

export const professionalInfoSchema = yup.object({
  specialtyId: yup.string().required("Specialty is required"),
  specialtyName: yup.string(),
  degree: yup.string().max(100, "Max 100 characters").required("Degree is required"),
  experienceYears: yup
    .number()
    .min(0, "Cannot be negative")
    .max(60, "Maximum 60 years")
    .integer("Must be a whole number")
    .required("Experience is required"),
});

export type ProfessionalInfoFormValues = yup.InferType<typeof professionalInfoSchema>;

export const DEGREE_OPTIONS = [
  "M.D. (Doctor of Medicine)",
  "D.O. (Doctor of Osteopathic Medicine)",
  "M.B.B.S.",
  "Ph.D.",
  "M.S. (Master of Surgery)",
  "Fellowship",
  "Other",
];
