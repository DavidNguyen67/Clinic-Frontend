"use client";

import { useEffect, useRef, useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { DEGREE_OPTIONS, ProfessionalInfoFormValues, professionalInfoSchema } from "./config";
import ProfessionalInfoSkeleton from "@/components/DoctorProrfile/ProfessionalInfoSkeleton";
import SpecialtyCombobox from "@/components/SpecialtyCombobox";

export function ProfessionalInfoForm() {
  const currentProfile = useCurrentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = currentProfile?.isLoading ?? true;

  const doctor = currentProfile?.data?.body?.doctor;

  const parentRef = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState(250);

  const initialValues = useRef<ProfessionalInfoFormValues>({
    specialtyId: "",
    specialtyName: "",
    degree: "",
    experienceYears: 0,
  });

  const onSubmit = async (
    values: ProfessionalInfoFormValues,
    helpers: FormikHelpers<ProfessionalInfoFormValues>
  ) => {
    try {
      console.log("Submit ProfessionalInfoForm:", values);
      // TODO: replace with real mutation
      await new Promise((r) => setTimeout(r, 600));
      setIsEditing(false);
      await currentProfile.mutate();
    } catch (error) {
      console.error(error);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik<ProfessionalInfoFormValues>({
    initialValues: initialValues.current,
    validationSchema: professionalInfoSchema,
    onSubmit,
  });

  useEffect(() => {
    if (doctor) {
      initialValues.current = {
        specialtyId: doctor.specialty?.id ?? "",
        specialtyName: doctor.specialty?.name ?? "",
        degree: doctor.degree ?? "",
        experienceYears: doctor.experienceYears ?? 0,
      };
      formik.setValues(initialValues.current);
    }
  }, [currentProfile?.data]);

  const handleToggleEdit = () => {
    if (isEditing) formik.resetForm();
    setIsEditing((prev) => !prev);
  };

  const editableInputCn = cn(
    "transition-all duration-200",
    isEditing && "ring-2 ring-teal-400/50 border-teal-400 bg-teal-50/30 focus-visible:ring-teal-500"
  );

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setParentWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return <ProfessionalInfoSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your specialty, degree and experience"
                : "Your clinical credentials"}
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
            aria-label={isEditing ? "Cancel editing" : "Edit professional info"}
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
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field ref={parentRef}>
              <FieldLabel>Specialty</FieldLabel>
              <SpecialtyCombobox
                disabled={!isEditing}
                value={formik.values.specialtyId}
                onValueChange={(val) => formik.setFieldValue("specialtyId", val)}
                classNames={{
                  popoverTrigger: cn(editableInputCn, "w-full"),
                }}
                width={`${parentWidth}px`}
              />
              {formik.errors.specialtyId && formik.touched.specialtyId && (
                <FieldDescription className="text-destructive">
                  {formik.errors.specialtyId}
                </FieldDescription>
              )}
            </Field>

            {/* Degree */}
            <Field>
              <FieldLabel htmlFor="degree">Degree</FieldLabel>
              <Select
                disabled={!isEditing}
                value={
                  DEGREE_OPTIONS.includes(formik.values.degree) ? formik.values.degree : "other"
                }
                onValueChange={(val) => {
                  if (val !== "other") formik.setFieldValue("degree", val);
                  else formik.setFieldValue("degree", "");
                }}
              >
                <SelectTrigger id="degree" className={cn(editableInputCn, "w-full")}>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other (enter below)</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom degree input when "Other" */}
              {!DEGREE_OPTIONS.includes(formik.values.degree) && (
                <Input
                  id="degreeCustom"
                  name="degree"
                  placeholder="Enter your degree…"
                  disabled={!isEditing}
                  value={formik.values.degree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(editableInputCn, "mt-2")}
                />
              )}
              {formik.touched.degree && formik.errors.degree && (
                <FieldDescription className="text-destructive text-xs">
                  {formik.errors.degree}
                </FieldDescription>
              )}
            </Field>

            {/* Experience years */}
            <Field>
              <FieldLabel htmlFor="experienceYears">Years of Experience</FieldLabel>
              <Input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min={0}
                max={60}
                placeholder="0"
                disabled={!isEditing}
                value={formik.values.experienceYears}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={editableInputCn}
              />
              {formik.touched.experienceYears && formik.errors.experienceYears && (
                <FieldDescription className="text-destructive text-xs">
                  {formik.errors.experienceYears}
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
