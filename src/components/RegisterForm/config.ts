import { GENDER, ROLE_NAME } from "@/common";
import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(255, "Email không được vượt quá 255 ký tự"),

  name: yup
    .string()
    .required("Họ tên là bắt buộc")
    .max(255, "Họ tên không được vượt quá 255 ký tự"),

  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại Việt Nam không hợp lệ"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu tối đa 128 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),

  dateOfBirth: yup
    .string()
    .required("Ngày sinh là bắt buộc")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày sinh phải đúng định dạng DD/MM/YYYY"),

  gender: yup
    .mixed<GENDER>()
    .oneOf(Object.values(GENDER), "Giới tính không hợp lệ")
    .required("Giới tính là bắt buộc"),

  role: yup
    .mixed<ROLE_NAME>()
    .oneOf(Object.values(ROLE_NAME), "Vai trò không hợp lệ")
    .required("Vai trò là bắt buộc"),
});
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
