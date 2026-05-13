import { useFormik } from "formik";
import {
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
} from "lucide-react";
import React, { useRef, useState } from "react";
import FieldError from "../FieldError";
import { LoginFormValues, loginSchema } from "./config";
import { useAuthConfig } from "../../features/auth/config";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const [showPass, setShow] = useState<boolean>(false);

  const initialFormValues = useRef<LoginFormValues>({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const { mutateAuthConfig, authConfig } = useAuthConfig();

  const loginForm = useFormik({
    initialValues: initialFormValues.current,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values);
      } catch (error) {}
      setSubmitting(false);
    },
  });

  const inputCls = (touched?: boolean, error?: string) =>
    `w-full py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
      touched && error
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
    }`;

  return (
    <form onSubmit={loginForm.handleSubmit}>
      {loginForm.status && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {loginForm.status}
        </div>
      )}

      <div className="space-y-4 mb-4">
        <div>
          <label
            className="block text-sm text-gray-700 mb-1.5"
            style={{ fontWeight: 500 }}
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={loginForm.values.email}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              className={`${inputCls(loginForm.touched.email, loginForm.errors.email)} pl-10 pr-4`}
              placeholder="example@email.com"
            />
          </div>
          <FieldError
            msg={loginForm.touched.email ? loginForm.errors.email : undefined}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="text-sm text-gray-700"
              style={{ fontWeight: 500 }}
            >
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => mutateAuthConfig({ view: "forgot" })}
              className="text-xs text-blue-600 hover:text-blue-700"
              style={{ fontWeight: 500 }}
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              className={`${inputCls(loginForm.touched.password, loginForm.errors.password)} pl-10 pr-10`}
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShow(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <FieldError
            msg={
              loginForm.touched.password ? loginForm.errors.password : undefined
            }
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loginForm.isSubmitting}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-blue-200"
        style={{ fontWeight: 600 }}
      >
        {loginForm.isSubmitting ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : null}
        {loginForm.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        {!loginForm.isSubmitting && <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">hoặc đăng nhập nhanh</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => mutateAuthConfig({ view: "register" })}
          className="text-blue-600 hover:text-blue-700"
          style={{ fontWeight: 600 }}
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
