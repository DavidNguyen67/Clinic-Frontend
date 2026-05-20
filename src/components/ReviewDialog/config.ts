import * as yup from "yup";

export const reviewSchema = yup.object({
  rating: yup.number().min(1, "Please select a rating").max(5).required("Rating is required"),
  title: yup.string().max(255, "Title must be at most 255 characters").optional(),
  content: yup.string().optional(),
});

export const reviewInitialValues: ReviewFormValues = {
  rating: 0,
  title: "",
  content: "",
};

export type ReviewFormValues = yup.InferType<typeof reviewSchema>;
