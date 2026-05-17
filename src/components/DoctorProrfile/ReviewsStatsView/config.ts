import * as Yup from "yup";

// ── Professional Info ─────────────────────────────────────────────────────────
export interface ProfessionalInfoFormValues {
  specialtyId: string;
  specialtyName: string;
  degree: string;
  experienceYears: number;
}

export const professionalInfoSchema = Yup.object({
  specialtyId: Yup.string().required("Specialty is required"),
  specialtyName: Yup.string(),
  degree: Yup.string().max(100, "Max 100 characters").required("Degree is required"),
  experienceYears: Yup.number()
    .min(0, "Cannot be negative")
    .max(60, "Maximum 60 years")
    .integer("Must be a whole number")
    .required("Experience is required"),
});

// ── Bio & Education ───────────────────────────────────────────────────────────
export interface BioFormValues {
  bio: string;
  education: string;
}

export const bioSchema = Yup.object({
  bio: Yup.string().max(1000, "Max 1000 characters"),
  education: Yup.string().max(2000, "Max 2000 characters"),
});

// ── Fee ───────────────────────────────────────────────────────────────────────
export interface FeeFormValues {
  consultationFee: number;
}

export const feeSchema = Yup.object({
  consultationFee: Yup.number()
    .min(0, "Fee cannot be negative")
    .max(100_000_000, "Fee seems too high")
    .required("Consultation fee is required"),
});

// ── Specialty options (hardcoded) ─────────────────────────────────────────────
export const SPECIALTY_OPTIONS = [
  { id: "sp-001", name: "General Practice" },
  { id: "sp-002", name: "Cardiology" },
  { id: "sp-003", name: "Dermatology" },
  { id: "sp-004", name: "Endocrinology" },
  { id: "sp-005", name: "Gastroenterology" },
  { id: "sp-006", name: "Neurology" },
  { id: "sp-007", name: "Obstetrics & Gynecology" },
  { id: "sp-008", name: "Oncology" },
  { id: "sp-009", name: "Ophthalmology" },
  { id: "sp-010", name: "Orthopedics" },
  { id: "sp-011", name: "Pediatrics" },
  { id: "sp-012", name: "Psychiatry" },
  { id: "sp-013", name: "Pulmonology" },
  { id: "sp-014", name: "Radiology" },
  { id: "sp-015", name: "Urology" },
];

export const DEGREE_OPTIONS = [
  "M.D. (Doctor of Medicine)",
  "D.O. (Doctor of Osteopathic Medicine)",
  "M.B.B.S.",
  "Ph.D.",
  "M.S. (Master of Surgery)",
  "Fellowship",
  "Other",
];
