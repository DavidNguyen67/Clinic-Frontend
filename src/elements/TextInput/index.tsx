"use client";

import "./style.scss";

import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

import clsx from "clsx";
import { Eye, EyeOff, X } from "lucide-react";

import Preload from "@/components/Preload";

export interface TextInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  helpIcon?: React.ReactNode;
  type?: string;
  inputClassName?: string;
  inputElementClassName?: string;
  className?: string;
  placeholder?: string;
  clearable?: boolean;
  labelPlacement?: "outside" | "inside";
  onClear?: () => void;
  hideErrorMessage?: boolean;
  labelClassName?: string;
  inEKyc?: boolean;
  maxLength?: number;
  loading?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement | null, TextInputProps>((props, ref) => {
  const {
    inEKyc,
    label,
    hasError,
    errorMessage,
    leadingIcon,
    helpIcon,
    className,
    inputClassName,
    placeholder,
    clearable,
    onClear,
    labelPlacement = "outside",
    disabled,
    hideErrorMessage,
    labelClassName,
    inputElementClassName,
    maxLength,
    loading,
    ...rest
  } = props;
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      setHasValue(input.value.length > 0);
    }
  }, [rest.value]);

  useImperativeHandle(ref, () => inputRef.current!, []);

  return (
    <div
      className={`input-container ${className ?? ""}  ${hasError ? "has-error" : ""} ${
        props.leadingIcon ? "has-leading" : ""
      }`}
      data-has-value={hasValue}
      data-label-placement={labelPlacement}
      data-disabled={disabled}
    >
      {label != null && labelPlacement === "outside" && (
        <label className="input-label" htmlFor="">
          {label}
        </label>
      )}
      <div
        className={clsx("relative", inputClassName, {
          "input-section-label-inside": labelPlacement === "inside",
          "input-section": labelPlacement === "outside",
        })}
      >
        {label != null && labelPlacement === "inside" && (
          <label className={clsx("input-label label-inside-animation", labelClassName)} htmlFor="">
            {label}
          </label>
        )}

        {props.leadingIcon && (
          <div className={clsx("leading-icon", inEKyc && "mt-[2.1rem]")}>{leadingIcon}</div>
        )}
        {props.type === "textarea" ? (
          <textarea
            {...rest}
            maxLength={maxLength}
            value={rest.value ?? ""}
            className={clsx(inputElementClassName)}
            placeholder={placeholder}
          />
        ) : (
          <input
            {...rest}
            maxLength={maxLength}
            value={rest.value ?? ""}
            type={props.type === "password" && show ? "text" : props.type}
            placeholder={placeholder}
            className={clsx(inputElementClassName, {
              "input-label-inside": labelPlacement === "inside",
            })}
            ref={inputRef}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              rest.onChange?.(e);
            }}
            disabled={disabled}
          />
        )}

        {props.helpIcon && (
          <button
            type="button"
            className={clsx("cursor-pointer", {
              "relative top-[1rem]": labelPlacement === "inside",
              "help-icon": labelPlacement === "outside",
            })}
          >
            {helpIcon}
          </button>
        )}
        {props.type === "password" && (
          <button
            type="button"
            className={clsx("cursor-pointer", {
              "relative top-[1rem]": labelPlacement === "inside",
              "help-icon": labelPlacement === "outside",
            })}
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOff className="size-[2.4rem] text-[#404040]" />
            ) : (
              <Eye className="size-[2.4rem] text-[#404040]" />
            )}
          </button>
        )}
        {clearable && (
          <button
            type="button"
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className={clsx("cursor-pointer", {
              "relative top-[1rem]": labelPlacement === "inside",
              "help-icon": labelPlacement === "outside",
            })}
            tabIndex={-1}
          >
            <X className="size-[2.4rem] text-[#404040]" />
          </button>
        )}
        {loading && <Preload />}
      </div>
      {props.hasError && !props?.hideErrorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
