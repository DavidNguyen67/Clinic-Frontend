"use client";
import { useEffect, useRef, useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import { Pencil, X, Camera, Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn, formatDate, getImageUrl, getInitials, parseDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicInfoFormValues, basicInfoSchema } from "./config";
import { GENDER } from "@/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { useUpdateUser } from "@/hooks/auth/useUpdateUser";
import _ from "lodash";

type VerifiedBadgeProps = {
  verified: boolean;
  onVerify?: () => void;
};

function VerifiedBadge({ verified, onVerify }: VerifiedBadgeProps) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600 border border-amber-200">
        <AlertCircle className="h-3 w-3" />
        Unverified
      </span>
    </span>
  );
}

function BasicInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          {/* Avatar skeleton */}
          <Skeleton className="h-16 w-16 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Edit button skeleton */}
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name — spans 2 cols */}
          <div className="sm:col-span-2 space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Date of birth */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BasicInfoForm() {
  const currentProfile = useCurrentProfile();

  const [isEditing, setIsEditing] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const { updateProfile } = useUpdateUser();

  const isLoading = currentProfile?.isLoading ?? true;

  const initialValues = useRef<BasicInfoFormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: GENDER.MALE,
    dateOfBirth: new Date(),
    avatarUrl: "",
  });

  const onSubmit = async (
    values: BasicInfoFormValues,
    helpers: FormikHelpers<BasicInfoFormValues>
  ) => {
    try {
      await updateProfile(values);
      setIsEditing(false);
      currentProfile.mutate();
    } catch (error) {
      console.error(error);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik<BasicInfoFormValues>({
    initialValues: initialValues.current,
    validationSchema: basicInfoSchema,
    onSubmit,
  });

  useEffect(() => {
    if (currentProfile?.data?.body) {
      initialValues.current = {
        fullName: currentProfile.data.body?.fullName,
        email: currentProfile.data.body?.email,
        phoneNumber: currentProfile.data.body?.phone,
        gender: currentProfile.data.body?.gender,
        dateOfBirth: parseDate(currentProfile.data.body?.dateOfBirth, "dd/MM/yyyy")!,
        avatarUrl: currentProfile.data.body?.pathAvatar,
      };

      formik.setValues(initialValues.current);
    }
  }, [currentProfile?.data]);

  const handleToggleEdit = () => {
    if (isEditing) {
      formik.resetForm();
      setAvatarPreview(null);
    }
    setIsEditing((prev) => !prev);
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const editableInputCn = cn(
    "transition-all duration-200",
    isEditing && "ring-2 ring-blue-400/50 border-blue-400 bg-blue-50/30 focus-visible:ring-blue-500"
  );

  const avatarSrc =
    avatarPreview || (formik.values.avatarUrl ? getImageUrl(formik.values.avatarUrl) : undefined);

  if (isLoading) return <BasicInfoSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        {/* ── Header ── */}
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            {/* Avatar with upload overlay */}
            <div
              className={cn("relative h-16 w-16 rounded-full", isEditing && "cursor-pointer")}
              onClick={handleAvatarClick}
              title={isEditing ? "Click to upload photo" : undefined}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarSrc} alt={formik.values.fullName} />
                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                  {getInitials(formik.values.fullName)}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="flex-1">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                {isEditing ? "Update your personal details" : "View your personal details"}
              </CardDescription>
            </div>

            {/* Edit / Cancel toggle */}
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
              aria-label={isEditing ? "Cancel editing" : "Edit basic info"}
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
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  disabled={!isEditing}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={editableInputCn}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <FieldDescription className="text-destructive text-xs">
                    {formik.errors.fullName}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">
                  <span className="flex items-center gap-2">
                    Email
                    <VerifiedBadge
                      verified={!!currentProfile?.data?.body?.emailVerified}
                      onVerify={() => console.log("trigger email verify flow")}
                    />
                  </span>
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  disabled={!isEditing}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={editableInputCn}
                />
                {formik.touched.email && formik.errors.email && (
                  <FieldDescription className="text-destructive text-xs">
                    {formik.errors.email}
                  </FieldDescription>
                )}
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phoneNumber">
                  <span className="flex items-center gap-2">
                    Phone number
                    <VerifiedBadge
                      verified={!!currentProfile?.data?.body?.phoneVerified}
                      onVerify={() => console.log("trigger phone verify flow")}
                    />
                  </span>
                </FieldLabel>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0912 345 678"
                  disabled={!isEditing}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={editableInputCn}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <FieldDescription className="text-destructive text-xs">
                    {formik.errors.phoneNumber}
                  </FieldDescription>
                )}
              </Field>

              {/* Gender */}
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <Select
                  disabled={!isEditing}
                  value={formik.values.gender}
                  onValueChange={(val) => formik.setFieldValue("gender", val as GENDER)}
                >
                  <SelectTrigger id="gender" className={cn(editableInputCn, "w-full")}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GENDER).map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <FieldDescription className="text-destructive text-xs">
                    {formik.errors.gender}
                  </FieldDescription>
                )}
              </Field>

              {/* Date of birth */}
              <Field>
                <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!isEditing}
                      id="dateOfBirth"
                      className={cn(editableInputCn, "w-full justify-start font-normal")}
                    >
                      {formik.values.dateOfBirth
                        ? formatDate(formik.values.dateOfBirth)
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      disabled={!isEditing}
                      selected={formik.values.dateOfBirth}
                      defaultMonth={formik.values.dateOfBirth}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        formik.setFieldValue("dateOfBirth", date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <FieldDescription className="text-red-500">
                    {String(formik.errors.dateOfBirth)}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            {/* Submit — only visible while editing */}
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
    </div>
  );
}
