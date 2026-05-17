import { BLOOD_TYPE, GENDER } from "@/common";
import * as yup from "yup";

// ─── Schema ───────────────────────────────────────────────────────────────────

export const profileSchema = yup.object({
  userId: yup.string().required("User ID is required"),

  // ── Basic Info ──────────────────────────────────────────────────────────────
  fullName: yup
    .string()
    .required("Full name is required")
    .max(255, "Full name must not exceed 255 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, "Invalid Vietnamese phone number"),

  gender: yup
    .mixed<GENDER>()
    .oneOf(Object.values(GENDER), "Invalid gender")
    .required("Gender is required"),

  dateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .typeError("Invalid date of birth"),

  avatarUrl: yup.string().url("Must be a valid URL").optional(),

  // ── Medical Info ────────────────────────────────────────────────────────────
  bloodType: yup
    .mixed<BLOOD_TYPE>()
    .oneOf(Object.values(BLOOD_TYPE), "Invalid blood type")
    .required("Blood type is required"),

  address: yup.string().max(500, "Address must not exceed 500 characters").optional(),

  insuranceNumber: yup
    .string()
    .max(100, "Insurance number must not exceed 100 characters")
    .optional(),

  allergies: yup.string().max(2000, "Allergies must not exceed 2000 characters").optional(),

  chronicDiseases: yup
    .string()
    .max(2000, "Chronic diseases must not exceed 2000 characters")
    .optional(),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
