import "./style.scss";

import React from "react";

import clsx from "clsx";
import Checked from "assets/svg/check.svg";

import type { ReactNode } from "react";
import { isBlank } from "@/utils/common";

interface Checkbox {
  selected?: boolean;
  label?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (name?: string, value?: boolean) => void;
  iconRender?: (selected?: boolean) => ReactNode;
  variant?: "gradient";
}

const Checkbox = (props: Checkbox) => {
  const onChange: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    props.onChange?.(props.name, !props.selected);
  };
  return (
    <button
      disabled={props.disabled}
      type="button"
      className={clsx(`checkbox border border-transparent ${props.className ?? ""}`, {
        "base-box-1 !rounded-[0.8rem] light:bg-white w-full p-3 text-base font-medium":
          props.variant === "gradient",
        " !border-[--brand-night] rounded-[0.8rem]": props.variant === "gradient" && props.selected,
      })}
      onClick={onChange}
    >
      {props.iconRender ? (
        props.iconRender(props.selected)
      ) : (
        <div className={`square ${props.selected ? "checked" : ""}`}>
          {props.selected && <Checked />}
        </div>
      )}
      {!isBlank(props.label) && (
        <div
          className={clsx("label text-medium", {
            "!text-base !font-medium": props.variant === "gradient",
            "text-gradient-1": props.variant === "gradient" && props.selected,
            "text-base-2": props.variant === "gradient" && !props.selected,
          })}
        >
          {props.label}
        </div>
      )}
    </button>
  );
};

export default Checkbox;
