"use client";

import { useEffect, useRef, useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { BioFormValues, bioSchema } from "@/components/DoctorProfile/BioEducationForm/config";
import { useDoctorProfile } from "@/hooks/doctor/useDoctorProfile";

// ── Textarea (not in shadcn Input) ───────────────────────────────────────────
function Textarea({
  className,
  maxLength,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { maxLength?: number }) {
  const len = typeof value === "string" ? value.length : 0;
  return (
    <div className="relative">
      <textarea
        value={value}
        maxLength={maxLength}
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground/50 resize-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200",
          className
        )}
        {...props}
      />
      {maxLength && (
        <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground tabular-nums">
          {len}/{maxLength}
        </span>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function BioSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[120, 180].map((h, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className={`h-[${h}px] w-full`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────
export function BioEducationForm() {
  const currentProfile = useCurrentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = currentProfile?.isLoading ?? true;

  const isUpdateMode = !!currentProfile.data?.body?.doctor;

  const doctor = currentProfile?.data?.body?.doctor;

  const initialValues = useRef<BioFormValues>({
    bio: "",
    education: "",
  });

  const { createDoctorProfile, updateDoctorProfile } = useDoctorProfile();

  const onSubmit = async (values: BioFormValues, helpers: FormikHelpers<BioFormValues>) => {
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

  const formik = useFormik<BioFormValues>({
    initialValues: initialValues.current,
    validationSchema: bioSchema,
    onSubmit,
  });

  useEffect(() => {
    if (doctor) {
      initialValues.current = {
        bio: doctor.bio ?? "",
        education: doctor.education ?? "",
      };
      formik.setValues(initialValues.current);
    }
  }, [currentProfile?.data]);

  const handleToggleEdit = () => {
    if (isEditing) formik.resetForm();
    setIsEditing((prev) => !prev);
  };

  const editableTextareaCn = cn(
    isEditing && "ring-2 ring-teal-400/50 border-teal-400 bg-teal-50/30 focus-visible:ring-teal-500"
  );

  if (isLoading) return <BioSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <CardTitle>Bio & Education</CardTitle>
            <CardDescription>
              {isEditing
                ? "Tell patients about yourself and your background"
                : "Your professional bio and education history"}
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
            aria-label={isEditing ? "Cancel editing" : "Edit bio & education"}
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
          <FieldGroup className="flex flex-col gap-5">
            {/* Bio */}
            <Field>
              <FieldLabel htmlFor="bio">About Me</FieldLabel>
              <Textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={1000}
                placeholder="Write a short introduction about yourself, your approach to medicine, and what patients can expect…"
                disabled={!isEditing}
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={editableTextareaCn}
              />
              {formik.touched.bio && formik.errors.bio && (
                <FieldDescription className="text-destructive text-xs">
                  {formik.errors.bio}
                </FieldDescription>
              )}
            </Field>

            {/* Education */}
            <Field>
              <FieldLabel htmlFor="education">Education & Training</FieldLabel>
              <Textarea
                id="education"
                name="education"
                rows={7}
                maxLength={2000}
                placeholder={`List your degrees, institutions and years, e.g.:\n• M.D. — Hanoi Medical University, 2010\n• Residency in Cardiology — Bach Mai Hospital, 2013\n• Fellowship — Singapore General Hospital, 2015`}
                disabled={!isEditing}
                value={formik.values.education}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={editableTextareaCn}
              />
              {formik.touched.education && formik.errors.education && (
                <FieldDescription className="text-destructive text-xs">
                  {formik.errors.education}
                </FieldDescription>
              )}
            </Field>
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
