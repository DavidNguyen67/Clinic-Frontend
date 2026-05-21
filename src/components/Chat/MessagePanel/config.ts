import * as yup from "yup";
import { MESSAGE_INPUT_MAX_LENGTH } from "@/components/Chat/config";

export const messageSchema = yup.object({
  content: yup.string().trim().min(1).max(MESSAGE_INPUT_MAX_LENGTH).required(),
});

export type MessageFormValues = yup.InferType<typeof messageSchema>;
