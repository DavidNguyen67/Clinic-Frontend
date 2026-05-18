"use client";

import { useEffect, useRef, useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { BadgeDollarSign, Loader2, Pencil, Save, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { FeeFormValues, feeSchema } from "@/components/DoctorProrfile/FeeForm/config";
import { useDoctorProfile } from "@/hooks/doctor/useDoctorProfile";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function FeeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-64" />
      </CardContent>
    </Card>
  );
}

// ── Preset fee chips ──────────────────────────────────────────────────────────
const FEE_PRESETS = [100_000, 150_000, 200_000, 300_000, 500_000];

// ── Form ──────────────────────────────────────────────────────────────────────
export function FeeForm() {
  const currentProfile = useCurrentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = currentProfile?.isLoading ?? true;

  const doctor = currentProfile?.data?.body?.doctor;

  const initialValues = useRef<FeeFormValues>({
    consultationFee: 0,
  });

  const isUpdateMode = !!currentProfile.data?.body?.doctor;

  const { createDoctorProfile, updateDoctorProfile } = useDoctorProfile();

  const onSubmit = async (values: FeeFormValues, helpers: FormikHelpers<FeeFormValues>) => {
    try {
      isUpdateMode ? await updateDoctorProfile(values) : await createDoctorProfile(values);
      setIsEditing(false);
      currentProfile.mutate();
    } catch (error) {
      console.error(error);
    } finally {
      helpers.setSubmitting(false);
    }
  };
  const formik = useFormik<FeeFormValues>({
    initialValues: initialValues.current,
    validationSchema: feeSchema,
    onSubmit,
  });

  useEffect(() => {
    if (doctor) {
      initialValues.current = {
        consultationFee: Number(doctor.consultationFee ?? 0),
      };
      formik.setValues(initialValues.current);
    }
  }, [currentProfile?.data]);

  const handleToggleEdit = () => {
    if (isEditing) formik.resetForm();
    setIsEditing((prev) => !prev);
  };

  const editableInputCn = cn(
    "transition-all duration-200 text-lg font-semibold h-12",
    isEditing && "ring-2 ring-teal-400/50 border-teal-400 bg-teal-50/30 focus-visible:ring-teal-500"
  );

  if (isLoading) return <FeeSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <CardTitle>Fee & Schedule</CardTitle>
            <CardDescription>
              {isEditing ? "Set your consultation fee" : "Your current consultation rate"}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleEdit}
            className={cn(
              "rounded-full transition-all duration-200",
              isEditing
                ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label={isEditing ? "Cancel editing" : "Edit fee"}
          >
            <span
              className={cn(
                "absolute transition-all duration-200",
                isEditing ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
            >
              <X className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "transition-all duration-200",
                isEditing ? "opacity-0 scale-75" : "opacity-100 scale-100"
              )}
            >
              <Pencil className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="consultationFee">Consultation Fee</FieldLabel>

              {/* Read-only: show formatted VND */}
              {!isEditing ? (
                <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-4 h-12">
                  <BadgeDollarSign className="h-5 w-5 text-teal-500 shrink-0" />
                  <span className="text-lg font-semibold text-foreground tabular-nums">
                    {formatCurrency(formik.values.consultationFee)}
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                    ₫
                  </span>
                  <Input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    min={0}
                    step={10_000}
                    placeholder="0"
                    disabled={!isEditing}
                    value={formik.values.consultationFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(editableInputCn, "pl-7")}
                  />
                </div>
              )}

              {formik.touched.consultationFee && formik.errors.consultationFee && (
                <FieldDescription className="text-destructive text-xs">
                  {formik.errors.consultationFee}
                </FieldDescription>
              )}

              {/* Live formatted preview */}
              {isEditing && formik.values.consultationFee > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Preview:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(formik.values.consultationFee)}
                  </span>
                </p>
              )}
            </Field>

            {/* Quick-pick presets — only show when editing */}
            {isEditing && (
              <Field>
                <FieldLabel>Quick select</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {FEE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => formik.setFieldValue("consultationFee", preset)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                        formik.values.consultationFee === preset
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-border text-muted-foreground hover:border-teal-400 hover:text-teal-600"
                      )}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
              </Field>
            )}
          </FieldGroup>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={formik.isSubmitting || !formik.dirty}
                className="gap-2 min-w-32.5"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
