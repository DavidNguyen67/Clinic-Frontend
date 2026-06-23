"use client";

import { Formik, FormikProps } from "formik";
import { useRef } from "react";
import { ROLE_NAME, USER_STATUS, GENDER } from "@/common";
import { userFormSchema } from "./config";
import TextInput from "@/elements/TextInput";
import Dropdown from "@/elements/Dropdown";
import { useUsers } from "./hooks";
import { Info } from "lucide-react";
import { formatDateToApi } from "@/lib/utils";
import { UserItem } from "@/interface/response";

interface UserFormProps {
  data?: UserItem;
}
interface UserFormValue {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  status: string;
}
const UserForm = ({ data }: UserFormProps) => {
  const { createUser, updateUser } = useUsers();
  const roleOptions = [
    { label: "Admin", value: ROLE_NAME.ADMIN },
    { label: "Doctor", value: ROLE_NAME.DOCTOR },
    { label: "Patient", value: ROLE_NAME.PATIENT },
    { label: "Staff", value: ROLE_NAME.STAFF },
    { label: "Guest", value: ROLE_NAME.GUEST },
  ];

  const statusOptions = [
    { label: "Active", value: USER_STATUS.ACTIVE },
    { label: "Inactive", value: USER_STATUS.INACTIVE },
    { label: "Banned", value: USER_STATUS.BANNED },
  ];
  const genderOptions = [
    { label: "Male", value: GENDER.MALE },
    { label: "Female", value: GENDER.FEMALE },
    { label: "Other", value: GENDER.OTHER },
  ];

  const initialValues: UserFormValue = {
    fullName: data?.fullName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    password: "",
    dateOfBirth: data?.dateOfBirth || "",
    gender: data?.gender || GENDER.MALE,
    role: data?.role || ROLE_NAME.PATIENT,
    status: data?.status || USER_STATUS.ACTIVE,
  };

  const formRef = useRef<FormikProps<UserFormValue> | null>(null);
  const handleSubmit = async (values: UserFormValue) => {
    console.log("Submitting form with values:", values);

    // Format date string from "YYYY-MM-DD" to "DD/MM/YYYY" for backend
    let formattedDate = values.dateOfBirth;
    if (values.dateOfBirth && values.dateOfBirth.includes("-")) {
      const [year, month, day] = values.dateOfBirth.split("-");
      formattedDate = `${day}/${month}/${year}`;
    }

    const payload = {
      name: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      dateOfBirth: formattedDate,
      gender: values.gender,
      role: values.role,
      status: values.status,
    };
    try {
      if (data) {
        await updateUser.trigger({ ...payload, id: data.id });
      } else {
        await createUser.trigger(payload);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      innerRef={(instance) => {
        formRef.current = instance!;
      }}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
      validationSchema={userFormSchema}
      className="w-full h-full"
    >
      {({ values, handleChange, handleSubmit, touched, errors, handleBlur, setFieldValue }) => {
        console.log("[ChallengeForm]", { touched, errors });

        return (
          <form
            className="mt-[2rem] lg:mt-[3.8rem] w-full flex flex-row justify-center flex-1 overflow-y-auto mb-[3%] hide-scrollbar"
            onSubmit={handleSubmit}
          >
            <div className="flex-1  xl:px-0 max-w-full flex flex-col justify-start overflow-x-hidden">
              <div className="flex flex-col">
                <div className="bg-[#F5F5FF] rounded-[8px]">
                  <div className="p-4 sm:p-[2.4rem] grid grid-cols-1 md:grid-cols-2 justify-center items-start gap-[2.4rem]">
                    <div className="text-[2rem]  text-[#1D1E2E] leading-[130%] md:col-span-2">
                      User Form
                    </div>
                    <TextInput
                      className="w-full"
                      type="text"
                      label="Full Name"
                      placeholder="Enter full name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.fullName && !!errors.fullName}
                      errorMessage={touched.fullName ? errors.fullName : ""}
                    />
                    <TextInput
                      className="w-full"
                      type="email"
                      label="Email"
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.email && !!errors.email}
                      errorMessage={touched.email ? errors.email : ""}
                    />
                    <TextInput
                      className="w-full"
                      type="text"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.phone && !!errors.phone}
                      errorMessage={touched.phone ? errors.phone : ""}
                    />
                    <TextInput
                      className="w-full"
                      type="password"
                      label="Password"
                      placeholder="Enter password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.password && !!errors.password}
                      errorMessage={touched.password ? errors.password : ""}
                    />
                    <TextInput
                      className="w-full"
                      type="date"
                      label="Date of Birth"
                      placeholder="Select date of birth"
                      name="dateOfBirth"
                      value={values.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.dateOfBirth && !!errors.dateOfBirth}
                      errorMessage={
                        touched.dateOfBirth && typeof errors.dateOfBirth === "string"
                          ? errors.dateOfBirth
                          : ""
                      }
                    />
                    <Dropdown
                      className="w-full"
                      label="Gender"
                      selected={values.gender}
                      options={genderOptions}
                      onChange={(val) => setFieldValue("gender", val)}
                      hasError={touched.gender && !!errors.gender}
                      errorMessage={
                        touched.gender && typeof errors.gender === "string" ? errors.gender : ""
                      }
                    />
                    <Dropdown
                      className="w-full"
                      label="Role"
                      selected={values.role}
                      options={roleOptions}
                      onChange={(val) => setFieldValue("role", val)}
                      hasError={touched.role && !!errors.role}
                      errorMessage={touched.role ? errors.role : ""}
                    />
                    <Dropdown
                      className="w-full"
                      label="Status"
                      selected={values.status}
                      options={statusOptions}
                      onChange={(val) => setFieldValue("status", val)}
                      hasError={touched.status && !!errors.status}
                      errorMessage={touched.status ? String(errors.status) : ""}
                    />
                  </div>
                  <div className="flex flex-row w-full gap-[1.7rem] justify-end items-center mb-[8px] mr-[2.4rem]">
                    <button
                      type="submit"
                      className="cursor-pointer rounded-[1.2rem] bg-[#E60028] p-[20px] text-center text-[1.8rem] text-[#FDFEFF]"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default UserForm;
