import * as yup from "yup";
import { ROLE_NAME, USER_STATUS, GENDER } from "@/common";
import {
  ColDef,
  ValueFormatterParams,
} from "ag-grid-community";
export const userFormSchema = yup.object().shape({
  fullName: yup.string().max(255).required("Vui lòng nhập họ tên"),
  email: yup.string().email("Tài khoản email không hợp lệ").max(255).required("Vui lòng nhập email"),
  phone: yup.string().matches(/^(\+84|0)[35789][0-9]{8}$/, "Số điện thoại không hợp lệ").required("Vui lòng nhập số điện thoại"),
  password: yup.string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(128, "Mật khẩu tối đa 128 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
  dateOfBirth: yup.string().required("Vui lòng nhập ngày sinh"),
  gender: yup.mixed<GENDER>().oneOf(Object.values(GENDER)).required("Vui lòng chọn giới tính"),
  role: yup.mixed<ROLE_NAME>().oneOf(Object.values(ROLE_NAME)).required("Vui lòng chọn vai trò"),
  status: yup.mixed<USER_STATUS>().oneOf(Object.values(USER_STATUS)).required("Vui lòng chọn trạng thái"),
  pathAvatar: yup.string().optional(),
});

export type UserFormValues = yup.InferType<typeof userFormSchema>;


const formatDate = (
  value?: string
) => {
  if (!value) return "-";

  try {
    if (
      value.includes("/")
    ) {
      return value;
    }

    return new Date(
      value
    ).toLocaleDateString(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  } catch {
    return value;
  }
};
export const getColumnDefs = (): Array<ColDef> => {
  const columnDefs: Array<ColDef> = [
   {
      field: "fullName",
      headerName: "Họ tên",
      flex: 1.5,
      minWidth: 220,
      sortable: true,
      filter: true,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.8,
      minWidth: 260,
      sortable: true,
      filter: true,
    },

    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
      minWidth: 150,
      sortable: true,
    },

    {
      field: "gender",
      headerName: "Giới tính",
      flex: 1,
      minWidth: 130,

      valueFormatter: (
        params
      ) => {
        const map = {
          MALE: "Nam",
          FEMALE: "Nữ",
          OTHER: "Khác",
        };

        return (
          map[
            params.value as keyof typeof map
          ] ??
          "-"
        );
      },

      sortable: true,
    },

    {
      field: "dateOfBirth",
      headerName: "Ngày sinh",
      flex: 1,
      minWidth: 140,

      valueFormatter: (
        params: ValueFormatterParams
      ) =>
        formatDate(
          params.value
        ),

      sortable: true,
    },

    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      minWidth: 150,

      valueFormatter: (
        params
      ) => {
        const map = {
          ADMIN:
            "Admin",
          DOCTOR:
            "Doctor",
          PATIENT:
            "Patient",
          STAFF:
            "Staff",
        };

        return (
          map[
            params.value as keyof typeof map
          ] ??
          params.value
        );
      },

      sortable: true,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      minWidth: 150,
      valueFormatter: (
        params
      ) => {
        const map = {
          ACTIVE:
            "Hoạt động",
          INACTIVE:
            "Không hoạt động",
          BANNED:
            "Bị cấm",
        };
        return (
          map[
            params.value as keyof typeof map
          ] ??
          params.value
        );
      },
    }
    
  ];
  return columnDefs;
};