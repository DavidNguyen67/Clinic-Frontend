"use client";

import { Formik, FormikProps } from "formik";
import { Info, Loader2, Save } from "lucide-react";

import { serviceFormSchema } from "./config";
import { useServices } from "./hooks";
import { ServiceItem } from "@/interface/response";

import Dropdown from "@/elements/Dropdown";
import TextInput from "@/elements/TextInput";
import { useRef } from "react";
import { useModal } from "@/hooks/common/useModal";

interface ServiceFormProps {
  data?: ServiceItem;
  onSuccess?: () => void;
}

interface ServiceFormValue {
  name: string;
  slug: string;
  description: string;
  image: string;
  price: string;
  promotionalPrice: string;
  duration: number;
  isActive: boolean;
  isFeatured: boolean;
  specialtyId: string;
}
const ServiceForm = ({ data, onSuccess }: ServiceFormProps) => {
  console.log("check data", data);
  const { createService, updateService, getSpecialties } = useServices();
  const specialties = getSpecialties.data?.body.data || [];
  const activeOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const featuredOptions = [
    { value: "true", label: "Featured" },
    { value: "false", label: "Normal" },
  ];
  const initialValues: ServiceFormValue = {
    name: data?.name ?? "",
    slug: data?.slug ?? "",
    description: data?.description ?? "",
    image: data?.image ?? "",
    price: data?.price?.toString() ?? "",
    promotionalPrice: data?.promotionalPrice?.toString() ?? "",
    duration: data?.duration ?? 30,
    isActive: data?.isActive ?? true,
    isFeatured: data?.isFeatured ?? false,
    specialtyId: data?.specialtyId ?? "",
  };

  const formRef = useRef<FormikProps<ServiceFormValue> | null>(null);
  const handleSubmit = async (values: ServiceFormValue) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      image: values.image,
      price: Number(values.price),
      promotionalPrice: values.promotionalPrice ? Number(values.promotionalPrice) : null,
      duration: Number(values.duration),
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      specialtyId: values.specialtyId,
    };

    try {
      if (data) {
        await updateService.trigger({
          ...payload,
          id: data.id,
        });
      } else {
        await createService.trigger(payload, {});
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        innerRef={(instance) => {
          formRef.current = instance!;
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={serviceFormSchema}
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
                        Service Form
                      </div>
                      <TextInput
                        required
                        label="Service Name"
                        className="w-full !h-[4.4rem]"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.name && !!errors.name}
                        errorMessage={touched.name ? errors.name : ""}
                      />
                      <TextInput
                        label="Slug"
                        required
                        name="slug"
                        className="w-full !h-[4.4rem]"
                        placeholder="e.g. general-checkup"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.slug && !!errors.slug}
                        errorMessage={touched.slug ? errors.slug : ""}
                      />
                      <TextInput
                        label="Description"
                        name="description"
                        required
                        value={values.description}
                        onChange={handleChange}
                        className="w-full !h-[4.4rem]"
                        onBlur={handleBlur}
                        hasError={touched.description && !!errors.description}
                        errorMessage={touched.description ? errors.description : ""}
                      />
                      <TextInput
                        label="Image URL"
                        name="image"
                        value={values.image}
                        required
                        className="w-full !h-[4.4rem]"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.image && !!errors.image}
                        errorMessage={touched.image ? errors.image : ""}
                      />
                      <TextInput
                        type="number"
                        label="Price"
                        name="price"
                        required
                        className="w-full !h-[4.4rem]"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.price && !!errors.price}
                        errorMessage={touched.price ? errors.price : ""}
                      />
                      <TextInput
                        type="number"
                        label="Promotional Price"
                        name="promotionalPrice"
                        value={values.promotionalPrice}
                        className="w-full !h-[4.4rem]"
                        onChange={handleChange}
                        required
                        onBlur={handleBlur}
                        hasError={touched.promotionalPrice && !!errors.promotionalPrice}
                        errorMessage={touched.promotionalPrice ? errors.promotionalPrice : ""}
                      />
                      <TextInput
                        type="number"
                        label="Duration (minutes)"
                        name="duration"
                        className="w-full !h-[4.4rem]"
                        required
                        value={values.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.duration && !!errors.duration}
                        errorMessage={touched.duration ? errors.duration : ""}
                      />

                      <Dropdown
                        label="Specialty"
                        selected={String(values.specialtyId)}
                        options={specialties.map((s) => ({ label: s.name, value: s.id }))}
                        onChange={(val) => setFieldValue("specialtyId", val)}
                      />
                      <Dropdown
                        label="Status"
                        selected={String(values.isActive)}
                        options={activeOptions}
                        onChange={(val) => setFieldValue("isActive", val === "true")}
                      />

                      <Dropdown
                        label="Featured"
                        selected={String(values.isFeatured)}
                        options={featuredOptions}
                        onChange={(val) => setFieldValue("isFeatured", val === "true")}
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
    </div>
  );
};

export default ServiceForm;
