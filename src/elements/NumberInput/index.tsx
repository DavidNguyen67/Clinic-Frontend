"use client";

import "./style.scss";

import { NumericFormat } from "react-number-format";
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

import clsx from "clsx";
import Plus from "assets/svg/plus.svg";
import Minus from "assets/svg/minus.svg";

import type { NumberFormatValues, NumericFormatProps } from "react-number-format";

interface NumberInputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value?: number;
  hasError?: boolean;
  disabled?: boolean;
  maxLength?: number;
  max?: number;
  disableSeparator?: boolean;
  minLot?: number;
  classNames?: {
    input?: string;
    container?: string;
    label?: string;
    btn?: string;
  };
  step?: number;
  showBtn?: boolean;
  prefix?: React.ReactNode;
  onChange?(field?: string, value?: number): void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  autoToFocus?: boolean;
  isAllowed?: NumericFormatProps["isAllowed"];
  className?: string;
  decimalScale?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const { name, placeholder, value, disabled, onChange, autoToFocus } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const onValueChange = (values: NumberFormatValues) => {
    if (onChange) {
      onChange(name, values.floatValue);
    }
  };

  useEffect(() => {
    if (!disabled && autoToFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [inputRef]);

  const step = props.step ?? 1;

  const decrease = () => {
    if (props.disabled) return;
    const newValue = (props.value ?? 0) - step;
    if (onChange) {
      onChange(props.name, newValue);
    }
  };

  const increase = () => {
    if (props.disabled) return;
    const newValue = (props.value ?? 0) + step;
    if (onChange) {
      onChange(props.name, newValue);
    }
  };

  return (
    <div className={clsx("w-full rounded-[0.8rem]", props.className)}>
      <div
        className={clsx(
          "rounded-[0.8rem] flex flex-col gap-1 w-full p-2 dark:border bg-[--bg-55] justify-center shadow-base-1",
          props.classNames?.container,
          {
            "!border-red-500": props.hasError,
            "border-[--bg-disabled]": disabled,
            "border-[--primary-2]": !disabled,
          },
          "numeric-container"
        )}
      >
        {props.label && (
          <div
            className={clsx("text-sm text-base-2", props.classNames?.label, {
              "text-red-500": props.hasError,
            })}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            {props.label || ""}
          </div>
        )}
        <div className="flex justify-between text-md w-full items-center">
          {props?.prefix && <div className="prefix">{props?.prefix}</div>}
          <button
            tabIndex={-1}
            type="button"
            onClick={decrease}
            className={clsx(
              "text-white-night",
              {
                hidden: !props.showBtn,
              },
              props.classNames?.btn
            )}
          >
            <Minus />
          </button>
          <NumericFormat
            className={clsx(
              "bg-transparent outline-none flex-1 numeric-input ",
              props.classNames?.input
            )}
            getInputRef={inputRef}
            thousandSeparator={!props?.disableSeparator ? "." : ""}
            decimalSeparator=","
            decimalScale={props.decimalScale ?? 2}
            allowNegative={false}
            isAllowed={props.isAllowed}
            name={name}
            placeholder={placeholder ? placeholder : ""}
            onValueChange={onValueChange}
            onBlur={props.onBlur}
            maxLength={props?.maxLength ?? 23}
            value={value ?? ""}
            max={props.max}
            disabled={disabled}
            autoComplete="off"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={increase}
            className={clsx(
              "text-white-night",
              {
                hidden: !props.showBtn,
              },
              props.classNames?.btn
            )}
          >
            <Plus />
          </button>
        </div>
      </div>
      {props.hasError && props.errorMessage && (
        <div className="text-red-500 mt-1 text-[1.4rem] leading-[1.6rem] font-[500]">
          {props.errorMessage}
        </div>
      )}
    </div>
  );
});

NumberInput.displayName = "NumberInput";

export default NumberInput;
