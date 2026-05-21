"use client";

import React, { useRef } from "react";
import { FormikHelpers, useFormik } from "formik";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MESSAGE_INPUT_MAX_LENGTH } from "@/components/Chat/config";
import { MessageFormValues, messageSchema } from "@/components/Chat/MessagePanel/config";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

function MessageInput({ onSend, disabled }: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async (values: MessageFormValues, helpers: FormikHelpers<MessageFormValues>) => {
    await onSend(values.content.trim());
    helpers.resetForm();
    textareaRef.current?.focus();
  };

  const initialValues = useRef<MessageFormValues>({ content: "" });

  const formik = useFormik<MessageFormValues>({
    initialValues: initialValues.current,
    validationSchema: messageSchema,
    onSubmit,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formik.submitForm();
    }
  };

  const canSend = formik.values.content.trim().length > 0 && !formik.isSubmitting && !disabled;

  return (
    <div className="border-t bg-background px-4 py-3 shrink-0">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          name="content"
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          className={cn("resize-none text-sm min-h-10 max-h-32 flex-1 py-2.5", "scrollbar-thin")}
          rows={1}
          value={formik.values.content}
          onChange={formik.handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || formik.isSubmitting}
          maxLength={MESSAGE_INPUT_MAX_LENGTH}
        />
        <Button
          size="icon"
          className="h-10 w-10 shrink-0"
          disabled={!canSend}
          onClick={() => formik.submitForm()}
          type="button"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default MessageInput;
