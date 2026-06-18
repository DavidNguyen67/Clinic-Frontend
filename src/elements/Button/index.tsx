import React from "react";

import clsx from "clsx";

import type { ButtonProps } from "@/interface";

const BUTTON_STYLE: Record<string, Record<string, string>> = {
  border: {
    success:
      "border border-[var(--green-night)] text-[var(--green-night)] disabled:text-[var(--text-4)] disabled:bg-night disabled:border-[--border-night]",
    waring:
      "border border-[var(--yellow)] text-[var(--yellow)] disabled:text-[var(--text-4)] disabled:bg-night disabled:border-[--border-night]",
    primary:
      "border border-[--brand-night] text-[--brand-night] disabled:text-[var(--text-4)] disabled:bg-night disabled:border-[--border-night]",
    error:
      "border border-[var(--red-night)] text-[var(--red-night)] disabled:text-[var(--text-4)] disabled:bg-night disabled:border-[--border-night]",
    default: "text-subtitle-night border bg-night-01 border-night",
  },
  solid: {
    success: "bg-[var(--green)] text-black",
    waring: "bg-[var(--yellow)] text-black",
    primary:
      "enabled:bg-gradient-1 dark:text-black light:text-white font-medium disabled:text-[var(--text-4)] disabled:bg-[--bg-12]",
    error: "bg-[var(--red)] text-black",
    default: "",
  },
  faded: {
    success: "text-[--green-night] bg-[--light-green]",
    waring: "text-[--yellow-night] bg-[#493819]",
    primary:
      "dark:text-[--yellow-night] light:text-[#FFFFFF] enabled:dark:bg-gradient-1 enabled:light:bg-[--blue] disabled:text-[var(--text-4)] disabled:bg-[--bg-12]",
    error: "bg-[--red-night] disabled:text-[var(--text-4)] disabled:bg-[--bg-12] text-[#222222]",
    default: "dark:text-[var(--text-4)] dark:bg-[var(--bg-12)] light:bg-white light:text-[#686868]",
  },
};

const BUTTON_SIZE: Record<string, string> = {
  sx: "h-[3.2rem] text-[1.4rem] leading-[1.6rem]",
  sm: "h-[3.6rem] text-base",
  md: "h-[4.8rem] text-xl",
  lg: "h-[5rem]",
};

const BUTTON_ROUNDED: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-[0.8rem]",
  xl: "rounded-xl",
};

const Button = (props: ButtonProps) => {
  const { label, icon, children, ...rest } = props;
  let { size, variant, color, rounded } = props;
  size = size ?? "md";
  variant = variant ?? "solid";
  color = color ?? "default";
  rounded = rounded ?? "lg";

  return (
    <button
      {...rest}
      className={clsx(
        "flex items-center justify-center rounded-[0.8rem] px-2 shadow-base-1",
        BUTTON_ROUNDED[rounded],
        BUTTON_SIZE[size],
        BUTTON_STYLE[variant]?.[color],
        props.className
      )}
      type={props.type ?? "button"}
    >
      {icon && <span>{icon}</span>}
      {label ? (label as string) : children}
    </button>
  );
};

export default Button;
