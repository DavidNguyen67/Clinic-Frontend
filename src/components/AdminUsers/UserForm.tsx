"use client";

import { Formik, FormikProps } from "formik";
import { useRef } from "react";
import { ROLE_NAME, USER_STATUS } from "@/common";
import { userFormSchema } from "./config";
import TextInput from "@/elements/TextInput";

interface UserFormProps {}
interface UserFormValue {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}
const UserForm = () => {
  const initialValues: UserFormValue = {
    fullName: "",
    email: "",
    phone: "",
    role: ROLE_NAME.PATIENT,
    status: USER_STATUS.ACTIVE,
  };
  const formRef = useRef<FormikProps<UserFormValue> | null>(null);
  const handleSubmit = async (values: UserFormValue) => {
    console.log("submit", values);
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
      {({
        values,
        handleChange,
        handleSubmit,
        touched,
        errors,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        validateField,
      }) => {
        console.log("[ChallengeForm]", { touched, errors });

        return (
          <form
            className="mt-[2rem] lg:mt-[3.8rem] w-full flex flex-row justify-center flex-1 overflow-y-auto mb-[3%] hide-scrollbar"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 px-[3%] xl:px-0 max-w-full sm:max-w-[95rem] md:max-w-[100rem] lg:max-w-[110rem] flex flex-col justify-start overflow-x-hidden">
              <div className="pt-[2rem] border-t-[1px] border-t-[#DEE0F2] border-t-solid mb-[5%] flex flex-col gap-[1rem] xl:gap-[2rem]">
                <div className="bg-[#F5F5FF] rounded-[8px]">
                  <div className="p-4 sm:p-[2.4rem] flex flex-col justify-center items-start gap-[2.4rem]">
                    <div className="text-[2rem] font-[700] text-[#1D1E2E] leading-[130%]">
                      User Form
                    </div>
                    <TextInput
                      className="w-full"
                      type="textarea"
                      label="FullName"
                      placeholder="Enter full name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.fullName && !!errors.fullName}
                      errorMessage={touched.fullName ? errors.fullName : ""}
                    />
                  </div>
                  <div className="flex flex-row w-full gap-[1.7rem] justify-end items-center pb-[3%] xl:pb-0">
                    <button
                      type="submit"
                      className="cursor-pointer mt-[1rem] xl:mt-[2rem] rounded-[1.2rem] bg-[#E60028] w-[25%] 2xl:w-[30%] py-[1rem] xl:py-[1.6rem] text-center text-[1.8rem] font-[600] text-[#FDFEFF]"
                    >
                      Save
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
