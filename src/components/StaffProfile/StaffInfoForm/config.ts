import * as yup from "yup";

export const staffInfoFormSchema = yup.object({
  staffCode: yup
    .string()
    .max(20, "Staff code must be at most 20 characters")
    .required("Staff code is required"),
  position: yup.string().max(100, "Position must be at most 100 characters"),
  department: yup.string().max(100, "Department must be at most 100 characters"),
  hireDate: yup.string(),
});

export type StaffInfoFormValues = yup.InferType<typeof staffInfoFormSchema>;
