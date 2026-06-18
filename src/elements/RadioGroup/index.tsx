"use client";

import "./style.scss";

import React from "react";
import { Radio, RadioGroup as RadioGroupCmp } from "@headlessui/react";

import clsx from "clsx";

interface RadioGroupProps {
  value?: string | number;
  onChange?(value: string | number): void;
  options?: { label: string; value: string }[];
  layout?: "row" | "col";
  labelClassName?: string;
}

const RadioGroup = (props: RadioGroupProps) => {
  return (
    <RadioGroupCmp
      className={clsx("flex gap-2 radio-group w-full", { "flex-col": props.layout === "col" })}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options?.map((item) => (
        <Radio
          key={item.value}
          as="div"
          className=" flex-1 flex items-center mr-5 cursor-pointer radio-option"
          value={item.value}
        >
          {({ checked }) => (
            <>
              <div
                className={` ${
                  checked ? "checked" : ""
                } bg-clip-content p-[2px] border-2 radio-input border-solid w-[2rem] aspect-square rounded-full  mr-3`}
              />
              <div className={`radio-label  ${props.labelClassName ?? ""}`}>{item.label}</div>
            </>
          )}
        </Radio>
      ))}
    </RadioGroupCmp>
  );
};

export default RadioGroup;
