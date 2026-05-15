"use client";

import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormValues, loginSchema } from "./config";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, getRedirectPath } = useAuth();

  const router = useRouter();

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, formikHelpers) => {
      try {
        await login(values);
        const path = getRedirectPath();
        router.push(path || "/");
      } catch (error) {}
      formikHelpers.setSubmitting(false);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.email}
                  </FieldDescription>
                )}
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" {...formik.getFieldProps("password")} />
                {formik.touched.password && formik.errors.password && (
                  <FieldDescription className="text-red-500">
                    {formik.errors.password}
                  </FieldDescription>
                )}
              </Field>

              {/* Actions */}
              <Field>
                <Button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
