import * as yup from "yup";
import { ROLE_NAME, USER_STATUS } from "@/common";

export const userFormSchema = yup.object().shape({
  fullName: yup.string().required("Vui lòng nhập họ tên"),
  email: yup.string().email("Tài khoản email không hợp lệ").required("Vui lòng nhập email"),
  phone: yup.string().required("Vui lòng nhập số điện thoại"),
  role: yup.mixed<ROLE_NAME>().oneOf(Object.values(ROLE_NAME)).required("Vui lòng chọn vai trò"),
  status: yup.mixed<USER_STATUS>().oneOf(Object.values(USER_STATUS)).required("Vui lòng chọn trạng thái"),
});

export type UserFormValues = yup.InferType<typeof userFormSchema>;
