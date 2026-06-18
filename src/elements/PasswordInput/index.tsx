"use client";

import "./style.scss";

import React, { useRef, useState, useEffect } from "react";

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { X } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  helpIcon?: React.ReactNode;
  type?: string;
  inputClassName?: string;
  inChangePassword?: boolean;
  inputElementClassName?: string;
  className?: string;
  placeholder?: string;
  clearable?: boolean;
  labelPlacement?: "outside" | "inside";
  onClear?: () => void;
  visibleTextClassName?: string;
}

const PasswordInput = (props: PasswordInputProps) => {
  const {
    label,
    hasError,
    errorMessage,
    leadingIcon,
    helpIcon,
    className,
    inputClassName,
    inChangePassword,
    placeholder,
    clearable,
    onClear,
    labelPlacement = "outside",
    inputElementClassName,
    visibleTextClassName,
    ...rest
  } = props;
  const [show, setShow] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputEnd = () => {
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      setHasValue(input.value.length > 0);
    }
  }, [rest.value]);

  return (
    <div
      className={`input-container password-input ${className ?? ""}  ${hasError ? "has-error" : ""} ${
        props.leadingIcon ? "has-leading" : ""
      }`}
      data-has-value={hasValue}
      data-label-placement={labelPlacement}
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
          <label className="input-label label-inside-animation" htmlFor="">
            {label}
          </label>
        )}

        {props.leadingIcon && <div className="leading-icon">{leadingIcon}</div>}
        {props.type === "textarea" ? (
          <textarea {...rest} value={rest.value ?? ""} />
        ) : (
          <div className="relative w-full">
            <input
              {...rest}
              value={rest.value ?? ""}
              type={props.type === "password" && show ? "text" : props.type}
              // placeholder={placeholder}
              className={clsx(
                inputElementClassName,
                "absolute !top-[1.2rem] caret-[var(--text-color-1)] text-transparent w-full z-[1]",
                {
                  "input-label-inside": labelPlacement === "inside",
                  "!text-[2rem] !font-500 !leading-[2.4rem]": show,
                  "tracking-[1.8rem]": !show,
                  "!tracking-[1.7rem]": (rest?.value ?? "").toString().length > 6 && !show,
                }
              )}
              ref={inputRef}
              onChange={(e) => {
                setHasValue(e.target.value.length > 0);
                rest.onChange?.(e);
              }}
            />
            <div
              onClick={() => {
                inputRef.current?.focus();
              }}
              className="absolute z-[1]  cursor-text top-[1.2rem] right-0 left-0 flex gap-[0.4rem] overflow-hidden"
            >
              {(props.value as string)?.length > 0 && show ? (
                <span
                  className={clsx("text-[2rem] leading-[2.4rem] font-[500]", visibleTextClassName)}
                >
                  {props.value}
                </span>
              ) : (
                Array.from({ length: (props.value as string).length }).map((_, index) => (
                  <span key={index} className="text-[var(--text-auto-fill)]">
                    *
                  </span>
                ))
              )}
              {!props.value && <span className="input-place-holder">{placeholder}</span>}
            </div>
          </div>
        )}

        {props.helpIcon && <div className="help-icon">{helpIcon}</div>}
        {props.type === "password" && (
          <button
            type="button"
            className={clsx("cursor-pointer", {
              "relative top-[1rem]": labelPlacement === "inside",
              "help-icon": labelPlacement === "outside",
            })}
            onClick={() => setShow(!show)}
          >
            {inChangePassword ? (
              <span>
                {show ? (
                  <Eye className="size-[2.4rem] text-[--text-2]" />
                ) : (
                  <EyeOff className="size-[2.4rem] text-[--text-2]" />
                )}
              </span>
            ) : show ? (
              <EyeOff className="size-[2.4rem] text-[--text-2]" />
            ) : (
              <Eye className="size-[2.4rem] text-[--text-2]" />
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
          >
            <X />
          </button>
        )}
      </div>
      {props.hasError && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default PasswordInput;
