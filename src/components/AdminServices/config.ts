import * as yup from "yup";

import type { ServiceResponse } from "@/interface/response";

export const serviceFormSchema = yup.object({
  name: yup.string()
    .max(100)
    .required("Name is required"),

  slug: yup.string()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers and hyphens only"
    )
    .max(120)
    .required("Slug is required"),

  description: yup.string().max(1000),

  image: yup.string().url("Invalid URL").max(500),

  price: yup.number()
    .positive("Price must be greater than 0")
    .required("Price is required"),

  promotionalPrice: yup.number()
    .nullable()
    .test(
      "promo-less-than-price",
      "Promotional price must be less than price",
      function (value) {
        if (!value) return true;
        return value < Number(this.parent.price);
      }
    ),

  duration: yup.number()
    .min(5)
    .max(480)
    .required("Duration is required"),

  specialtyId: yup.string().required("Specialty is required"),
});

export type ServiceFormValues = yup.InferType<typeof serviceFormSchema>;

