"use client";

import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, KeyRound, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  EmailFormValues,
  emailSchema,
  OtpFormValues,
  otpSchema,
  ResetFormValues,
  resetSchema,
} from "./config";
import { useAuth } from "@/hooks/useAuth";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "reset" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_COUNTDOWN_SECONDS = 120; // 2 phút

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { key: "otp", label: "OTP", icon: <ShieldCheck className="h-4 w-4" /> },
  { key: "reset", label: "Reset", icon: <KeyRound className="h-4 w-4" /> },
];

const STEP_ORDER: Step[] = ["email", "otp", "reset", "done"];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEP_ORDER.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, idx) => {
        const isDone = currentIdx > idx;
        const isActive = current === step.key;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 text-xs font-medium",
                isDone && "bg-primary border-primary text-primary-foreground",
                isActive && !isDone && "border-primary text-primary",
                !isDone && !isActive && "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:inline",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px mx-1 transition-all duration-300",
                  currentIdx > idx ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setSeconds(initialSeconds);
  };

  useEffect(() => {
    if (seconds <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [seconds]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return { seconds, formatted, start };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const [apiError, setApiError] = useState("");
  const { seconds, formatted, start: startCountdown } = useCountdown(OTP_COUNTDOWN_SECONDS);

  const resetFormik = useFormik<ResetFormValues>({
    initialValues: { resetToken: "", newPassword: "", confirmPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      setApiError("");
      try {
        await resetPassword(values);
        setStep("done");
      } catch (err) {
        setApiError((err as Error).message);
      }
    },
  });

  const otpFormik = useFormik<OtpFormValues>({
    initialValues: { email, otp: "" },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      setApiError("");
      try {
        const response = await verifyOtp(values);
        void values;
        resetFormik.setFieldValue("resetToken", response?.body?.resetToken, false);
        setStep("reset");
      } catch (err) {
        setApiError((err as Error).message);
      }
    },
  });

  const emailFormik = useFormik<EmailFormValues>({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      setApiError("");
      try {
        await forgotPassword(values);
        setEmail(values.email);
        setStep("otp");
        startCountdown();
      } catch (err) {
        setApiError((err as Error).message);
      }
    },
  });

  const handleResend = async () => {
    if (seconds > 0) return;
    setApiError("");
    try {
      const formValues: EmailFormValues = {
        email,
      };

      await forgotPassword(formValues);
      otpFormik.resetForm();
      startCountdown();
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  const stepMeta: Record<Exclude<Step, "done">, { title: string; description: string }> = {
    email: {
      title: "Forgot password",
      description: "Enter your email to receive a one-time verification code.",
    },
    otp: {
      title: "Enter OTP",
      description: `We sent a 6-digit code to ${email}. It expires in ${formatted}.`,
    },
    reset: {
      title: "New password",
      description: "Choose a strong password for your account.",
    },
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        {step !== "done" && (
          <CardHeader>
            {step !== "email" && (
              <button
                type="button"
                onClick={() => {
                  setStep(step === "reset" ? "otp" : "email");
                  setApiError("");
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 w-fit transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            <StepIndicator current={step} />
            <CardTitle>{stepMeta[step].title}</CardTitle>
            <CardDescription>{stepMeta[step].description}</CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {/* ── Global API error ── */}
          {apiError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          {/* ════════════════════════════════ STEP: EMAIL ══════════════════════════════ */}
          {step === "email" && (
            <form onSubmit={emailFormik.handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...emailFormik.getFieldProps("email")}
                  />
                  {emailFormik.touched.email && emailFormik.errors.email && (
                    <FieldDescription className="text-red-500">
                      {emailFormik.errors.email}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={emailFormik.isSubmitting}>
                    {emailFormik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}

          {/* ════════════════════════════════ STEP: OTP ════════════════════════════════ */}
          {step === "otp" && (
            <form onSubmit={otpFormik.handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    className="tracking-[0.5em] text-center text-lg font-mono"
                    {...otpFormik.getFieldProps("otp")}
                    // Chỉ cho nhập số
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      otpFormik.setFieldValue("otp", val);
                    }}
                  />
                  {otpFormik.touched.otp && otpFormik.errors.otp && (
                    <FieldDescription className="text-red-500">
                      {otpFormik.errors.otp}
                    </FieldDescription>
                  )}
                </Field>

                {/* Countdown + resend */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {seconds > 0 ? (
                      <>
                        Code expires in{" "}
                        <span className="font-mono font-medium text-foreground">{formatted}</span>
                      </>
                    ) : (
                      <span className="text-red-500">Code expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={seconds > 0}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      seconds > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:underline underline-offset-4"
                    )}
                  >
                    Resend code
                  </button>
                </div>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otpFormik.isSubmitting || seconds === 0}
                  >
                    {otpFormik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {/* ════════════════════════════════ STEP: RESET ══════════════════════════════ */}
          {step === "reset" && (
            <form onSubmit={resetFormik.handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    {...resetFormik.getFieldProps("newPassword")}
                  />
                  {resetFormik.touched.newPassword && resetFormik.errors.newPassword ? (
                    <FieldDescription className="text-red-500">
                      {resetFormik.errors.newPassword}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      At least 8 characters with uppercase, lowercase, number, and special
                      character.
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...resetFormik.getFieldProps("confirmPassword")}
                  />
                  {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                    <FieldDescription className="text-red-500">
                      {resetFormik.errors.confirmPassword}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={resetFormik.isSubmitting}>
                    {resetFormik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {/* ════════════════════════════════ STEP: DONE ═══════════════════════════════ */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium">Password reset!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your password has been updated. You can now sign in.
                </p>
              </div>
              <Button asChild className="w-full mt-2">
                <Link href="/auth/login">Back to sign in</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
