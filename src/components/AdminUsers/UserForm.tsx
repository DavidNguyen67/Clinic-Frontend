"use client";

import { Formik, FormikProps } from "formik";
import { Info, Loader2, Save } from "lucide-react";

import { ROLE_NAME, USER_STATUS, GENDER } from "@/common";
import { userFormSchema } from "./config";
import { useUsers } from "./hooks";
import { UserItem } from "@/interface/response";

import Dropdown from "@/elements/Dropdown";
import TextInput from "@/elements/TextInput";
import { useRef } from "react";

interface UserFormProps {
  data?: UserItem;
  onSuccess?: () => void;
}

interface UserFormValue {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  status: string;
}
const UserForm = ({ data, onSuccess }: UserFormProps) => {
  const { createUser, updateUser } = useUsers();

  const genderOptions = [
    { value: GENDER.MALE, label: "Male" },
    { value: GENDER.FEMALE, label: "Female" },
    { value: GENDER.OTHER, label: "Other" },
  ];
  const roleOptions = [
    { value: ROLE_NAME.ADMIN, label: "Admin" },
    { value: ROLE_NAME.DOCTOR, label: "Doctor" },
    { value: ROLE_NAME.PATIENT, label: "Patient" },
    { value: ROLE_NAME.STAFF, label: "Staff" },
  ];
  const statusOptions = [
    { value: USER_STATUS.ACTIVE, label: "Active" },
    { value: USER_STATUS.INACTIVE, label: "Inactive" },
    { value: USER_STATUS.BANNED, label: "Banned" },
  ];
  const initialValues: UserFormValue = {
    fullName: data?.fullName ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    password: "",
    dateOfBirth: "",
    gender: data?.gender ?? GENDER.MALE,
    role: data?.role ?? ROLE_NAME.PATIENT,
    status: data?.status ?? USER_STATUS.ACTIVE,
  };

  const formRef = useRef<FormikProps<UserFormValue> | null>(null);
  const handleSubmit = async (values: UserFormValue) => {
    console.log("Submitting form with values:", values);

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
        await createUser.trigger(payload, {});
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
                    <div className="text-[2rem] border-b border-[#D9D9D9] text-[#1D1E2E] leading-[130%] md:col-span-2">
                      User Form
                    </div>
                    <TextInput
                      required
                      className="w-full !h-[4.4rem]"
                      type="text"
                      label="Full Name"
                      placeholder="Enter full name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.fullName && Boolean(errors.fullName)}
                    />
                    <TextInput
                      className="w-full !h-[4.4rem]"
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
                      className="w-full !h-[4.4rem]"
                      type="text"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      name="phone"
                      inputMode="numeric"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.phone && Boolean(errors.phone)}
                    />
                    <TextInput
                      className="w-full !h-[4.4rem]"
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
                      className="w-full !h-[4.4rem]"
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
                  <div className="flex justify-end pr-[42px] mb-[8px]">
                    <button
                      type="submit"
                      className="cursor-pointer rounded-[8px] bg-[#E60028] px-[20px] py-[16px] text-center text-[14px] text-[#FDFEFF]"
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
