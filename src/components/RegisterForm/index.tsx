// RegisterForm.tsx
import { useFormik } from "formik";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "./config";
import { GENDER, ROLE_NAME } from "@/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialValues: RegisterFormValues = {
  email: "",
  name: "",
  phone: "",
  password: "",
  dateOfBirth: "",
  gender: GENDER.FEMALE,
  role: ROLE_NAME.PATIENT,
};

const RegisterForm = () => {
  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("Body:", values);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <FieldGroup>
            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <FieldDescription className="text-red-500">{formik.errors.name}</FieldDescription>
              )}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <FieldDescription className="text-red-500">{formik.errors.email}</FieldDescription>
              ) : (
                <FieldDescription>We'll use this to contact you.</FieldDescription>
              )}
            </Field>

            {/* Phone */}
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="phone"
                type="text"
                placeholder="0912345678"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone && (
                <FieldDescription className="text-red-500">{formik.errors.phone}</FieldDescription>
              )}
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password ? (
                <FieldDescription className="text-red-500">
                  {formik.errors.password}
                </FieldDescription>
              ) : (
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              )}
            </Field>

            {/* Date of Birth */}
            <Field>
              <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
              <Input
                id="dateOfBirth"
                type="text"
                placeholder="DD/MM/YYYY"
                {...formik.getFieldProps("dateOfBirth")}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <FieldDescription className="text-red-500">
                  {formik.errors.dateOfBirth}
                </FieldDescription>
              )}
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <Select
                value={formik.values.gender}
                onValueChange={(value) => {
                  formik.setFieldValue("gender", value);
                  formik.setFieldTouched("gender", true);
                }}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="-- Select Gender --" />
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
                <FieldDescription className="text-red-500">{formik.errors.gender}</FieldDescription>
              )}
            </Field>

            {/* Role */}
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select
                value={formik.values.role}
                onValueChange={(value) => {
                  formik.setFieldValue("role", value);
                  formik.setFieldTouched("role", true);
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="-- Select Role --" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ROLE_NAME).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <FieldDescription className="text-red-500">{formik.errors.role}</FieldDescription>
              )}
            </Field>

            {/* Submit */}
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
