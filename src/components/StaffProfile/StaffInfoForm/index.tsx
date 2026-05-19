"use client";

import { FormikHelpers, useFormik } from "formik";
import { Briefcase, Building2, Loader2, Pencil, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import {
  staffInfoFormSchema,
  StaffInfoFormValues,
} from "@/components/StaffProfile/StaffInfoForm/config";
import { useStaffProfile } from "@/hooks/staff/useStaffProfile";

function FormSkeleton() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        <div className="h-3.5 w-64 rounded bg-muted animate-pulse mt-1" />
      </CardHeader>
      <CardContent className="space-y-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
            <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StaffInfoForm() {
  const { data, isLoading, error, mutate } = useCurrentProfile();

  const { updateStaffProfile, createStaffProfile } = useStaffProfile();

  const user = data?.body;
  const staff = user?.staff;

  const [isEditing, setIsEditing] = useState(false);
  const FIELD_TRANSITION = useRef("transition-all duration-200 ease-in-out");

  const isUpdateMode = !!staff;

  // Auto-collapse edit when data loads and staff already exists
  useEffect(() => {
    setIsEditing(!isUpdateMode);
  }, [isUpdateMode]);

  const initialValues = useRef<StaffInfoFormValues>({
    staffCode: "",
    position: "",
    department: "",
    hireDate: "",
  });

  const formik = useFormik<StaffInfoFormValues>({
    initialValues: initialValues.current,
    validationSchema: staffInfoFormSchema,
    onSubmit: async (values: StaffInfoFormValues, helpers: FormikHelpers<StaffInfoFormValues>) => {
      try {
        isUpdateMode ? await updateStaffProfile(values) : await createStaffProfile(values);
        setIsEditing(false);
        mutate();
      } catch (err) {
        console.error(err);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // Sync formik values when staff data arrives
  useEffect(() => {
    if (staff) {
      const next: StaffInfoFormValues = {
        staffCode: staff.staffCode ?? "",
        position: staff.position ?? "",
        department: staff.department ?? "",
        hireDate: staff.hireDate ?? "",
      };
      initialValues.current = next;
      formik.setValues(next);
    }
  }, [staff]);

  const handleToggleEdit = () => {
    if (isEditing) formik.resetForm();
    setIsEditing((prev) => !prev);
  };

  const editableInputCn = cn(
    FIELD_TRANSITION.current,
    isEditing && "ring-2 ring-indigo-400/50 border-indigo-400 bg-indigo-50/30 focus:ring-indigo-500"
  );

  // ── Loading / Error states ────────────────────────────────────────────────

  if (isLoading) return <FormSkeleton />;

  if (error) {
    return (
      <Card className="border-destructive/40 shadow-sm">
        <CardContent className="py-10 text-center">
          <p className="text-sm text-destructive">Failed to load staff profile.</p>
        </CardContent>
      </Card>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Professional Information</CardTitle>
            <CardDescription className="text-[13px]">
              {isEditing
                ? "Update your position and department"
                : "Staff position, department details"}
            </CardDescription>
          </div>

          {/* ── Edit / Cancel toggle — mirrors MedicalInfoForm ── */}
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
            aria-label={isEditing ? "Cancel editing" : "Edit professional info"}
          >
            {/* Cross-fade X ↔ Pencil */}
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
        <div
          className={cn(
            FIELD_TRANSITION.current,
            isEditing ? "opacity-100 translate-y-0" : "opacity-90"
          )}
        >
          <form onSubmit={formik.handleSubmit}>
            <FieldGroup>
              {/* Position */}
              <Field>
                <FieldLabel htmlFor="position">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    Position
                  </span>
                </FieldLabel>
                <Input
                  id="position"
                  placeholder="e.g. Receptionist, Nurse, Lab Technician"
                  disabled={!isEditing}
                  className={editableInputCn}
                  maxLength={100}
                  {...formik.getFieldProps("position")}
                />
                {formik.touched.position && formik.errors.position && (
                  <FieldDescription className="text-destructive">
                    {formik.errors.position}
                  </FieldDescription>
                )}
              </Field>

              {/* Department */}
              <Field>
                <FieldLabel htmlFor="department">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Department
                  </span>
                </FieldLabel>
                <Input
                  id="department"
                  placeholder="e.g. Front Desk, Laboratory, Administration"
                  disabled={!isEditing}
                  className={editableInputCn}
                  maxLength={100}
                  {...formik.getFieldProps("department")}
                />
                {formik.touched.department && formik.errors.department && (
                  <FieldDescription className="text-destructive">
                    {formik.errors.department}
                  </FieldDescription>
                )}
              </Field>

              {/* Save — only visible while editing */}
              {isEditing && (
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={formik.isSubmitting || !formik.dirty}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {formik.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {formik.isSubmitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              )}
            </FieldGroup>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
