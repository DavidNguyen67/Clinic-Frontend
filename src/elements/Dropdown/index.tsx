"use client";

import "./style.scss";

import React, { useRef, useMemo, Fragment, useState, useEffect } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import clsx from "clsx";
import TextInput from "../TextInput";
import SearchIcon from "assets/svg/search-icon.svg";
import { CircleChevronDown, Info, Search } from "lucide-react";

export type DropdownProps = {
  options?: DropdownOption[];
  placeholder?: string;
  selected?: string;
  onChange?: (value: string) => void;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  btnClassName?: string;
  listOptionClassName?: string;
  hasSearch?: boolean;
  initial?: boolean;
  inputTextClassName?: string;
  labelPlacement?: "outside" | "inside";
  stickySearch?: boolean;
  renderOption?: (option: DropdownOption, selected?: boolean) => React.ReactNode;
  searchClassName?: string;
  disabled?: boolean;
  containerClassName?: string;
  classNames?: {
    option?: string;
    container?: string;
  };
  selectedIcon?: React.ReactNode;
  gutter?: number;
};

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  iconUrl?: string;
  shortName?: string;
  tooltip?: string;
}

const Dropdown = (props: DropdownProps) => {
  const {
    labelPlacement = "outside",
    searchClassName,
    containerClassName,
    selectedIcon,
    gutter,
    ...rest
  } = props;
  const { label, hasError, errorMessage, className, btnClassName, listOptionClassName, hasSearch } =
    props;
  const [searchValue, setSearchValue] = useState("");

  const [selected, setSelected] = useState<string | undefined>(
    props.options?.find((item) => item.value === props.selected)?.value
  );

  useEffect(() => {
    if (props.selected !== selected) {
      setSelected(props.selected);
    }
  }, [props.selected]);

  useEffect(() => {
    if (props.initial && props.options?.length) {
      const active = props.options?.find((item) => item.value === props.selected);
      if (active == null) {
        handleChange(props.options[0].value);
      }
    }
  }, [props.options]);

  const handleChange = (value: string) => {
    setSelected(value);
    props.onChange?.(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredOptions = props.options?.filter((option) =>
    option.label?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOption = useMemo(
    () => props.options?.find((item) => item.value === selected),
    [props.options, selected]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setDropdownWidth(containerRef.current.clientWidth + (gutter ?? 0));
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={clsx("dropdown-container overflow-visible  relative ", className, {
        "has-error": hasError,
      })}
      data-has-value={Boolean(selected)}
      ref={containerRef}
    >
      {label != null && labelPlacement === "outside" && (
        <label className="dropdown-label" htmlFor="">
          {label}
        </label>
      )}
      <Listbox disabled={props.disabled} value={selected || ""} onChange={handleChange}>
        <div className={clsx("relative w-full h-full")}>
          <ListboxButton
            className={`dropdown-button shadow-base-1 relative bg-[#F5F5FF] ${btnClassName}`}
            data-label-placement={labelPlacement}
          >
            {labelPlacement === "outside" && (
              <>
                {selectedOption?.tooltip && (
                  <div>
                    <Info className="size-[2rem]" />;
                  </div>
                )}

                <span
                  className={clsx(
                    "block font-normal light:font-medium text-[#404040]",
                    props.inputTextClassName
                  )}
                >
                  {selectedIcon && (
                    <div className="size-[2.4rem] flex items-center justify-center">
                      {selectedIcon}
                    </div>
                  )}
                  {selectedOption?.label ?? props.placeholder ?? ""}
                </span>
              </>
            )}
            {labelPlacement === "inside" && label != null && (
              <>
                <label
                  className="dropdown-label !mb-[0rem]"
                  htmlFor=""
                  data-label-placement={labelPlacement}
                >
                  {label}
                </label>
                <span
                  className={clsx(
                    "block font-normal light:font-medium text-[#404040]",
                    props.inputTextClassName
                  )}
                >
                  {selectedIcon && (
                    <div className="size-[2.4rem] flex items-center justify-center">
                      {selectedIcon}
                    </div>
                  )}
                  {selectedOption ? selectedOption.label : ((props.placeholder as string) ?? "")}
                </span>
              </>
            )}
            <CircleChevronDown
              className="!h-[2.4rem] !w-[2.4rem] !text-[#404040]"
              aria-hidden="true"
            />
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              anchor="bottom end"
              style={{ width: dropdownWidth }}
              className={clsx(
                "mt-[0.8rem] border !rounded-[0.8rem] border-[#D9D9D9] shadow-base-1 flex flex-col",
                hasSearch ? "max-h-[31.2rem]" : "max-h-[32rem]",
                "rounded-md bg-[#F5F5FF] py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50",
                {
                  "!p-[0.8rem]": !props.stickySearch,
                  "!p-[0rem]": props.stickySearch,
                },
                listOptionClassName
              )}
            >
              {hasSearch && (
                <TextInput
                  placeholder="trading.search"
                  name="bankAccount"
                  className={clsx(
                    "rounded-[0.4rem] shadow-base-1",
                    {
                      "sticky top-0 z-10 !bg-[--bg-01-night] p-[0.8rem] w-full": props.stickySearch,
                      "w-95 ml-[0.8rem]": !props.stickySearch,
                    },
                    searchClassName
                  )}
                  maxLength={20}
                  value={searchValue}
                  inputClassName="!bg-[--bg-01-night] border-none !text-[1.4rem] !leading-[1.6rem] !p-[0rem] !h-[3.2rem] relative h-[3.2rem]"
                  onChange={handleSearchChange}
                  onKeyDown={(e: { code: string; stopPropagation: () => void }) => {
                    if (e.code === "Space") {
                      e.stopPropagation();
                    }
                  }}
                  inputElementClassName="!text-[1.4rem] !leading-[1.6rem] !px-[1.2rem] !py-[0.8rem] !pl-[3.2rem]"
                  leadingIcon={
                    <Search className="w-[1.6rem] h-[1.6rem] absolute top-0 left-[1.2rem] translate-y-[25%]" />
                  }
                />
              )}
              <div className="h-full overflow-auto flex-1 hide-scrollbar max-h-[30rem]">
                {filteredOptions?.map((option, idx) => {
                  const bankLogoUrl = option?.iconUrl ?? "";
                  if (!props.stickySearch) {
                    return (
                      <ListboxOption
                        key={option.value}
                        className={({ selected }) =>
                          `relative cursor-pointer select-none px-1 py-[1.2rem] text-[--text-color-1] ${
                            selected ? "bg-[var(--select-hover)]" : ""
                          } ${idx !== filteredOptions.length - 1 ? "border-b-[1px] border-[--border-16]" : ""}`
                        }
                        value={option.value}
                      >
                        {({ selected }) => {
                          if (props.renderOption) {
                            return (props.renderOption(option, selected) as any) || <></>;
                          }
                          return (
                            <>
                              {option?.iconUrl && option?.shortName ? (
                                <div className="flex flex-row justify-start items-center">
                                  <img
                                    width={300}
                                    height={300}
                                    className="aspect-square object-cover w-[3rem] h-[3rem] mr-[1.6rem]"
                                    src={option?.iconUrl}
                                    alt="avatar"
                                  />
                                  <div>
                                    <div className="text-[--text-color-1] text-[1.4rem] leading-[125%]">
                                      {option?.shortName}
                                    </div>
                                    <div className="text-[--text-color-1] text-[1rem] mt-[2px] leading-[125%]">
                                      {option?.label}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div
                                    className={clsx(
                                      "block truncate px-[0.4rem]",
                                      props.classNames?.option
                                    )}
                                  >
                                    {option.label}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        }}
                      </ListboxOption>
                    );
                  }

                  return (
                    <ListboxOption
                      as="div"
                      key={option.value}
                      className={({ selected }) =>
                        clsx(
                          "relative cursor-pointer select-none px-[0.8rem] py-[1.6rem] text-[--text-color-1]",
                          { "bg-[var(--select-hover)]": selected },
                          {
                            "border-b border-b-[--border-16] mx-[0.8rem]":
                              idx <= filteredOptions.length - 1,
                          }
                        )
                      }
                      value={option.value}
                    >
                      {({ selected }) => {
                        if (props.renderOption) {
                          return (props.renderOption(option, selected) as any) || <></>;
                        }
                        return (
                          <div className="flex items-center gap-[1.6rem] px-[0.8rem]">
                            <div className="h-[3.2rem] w-[3.2rem]">
                              {bankLogoUrl && (
                                <img src={bankLogoUrl ?? ""} alt="logo" width={32} height={32} />
                              )}
                            </div>
                            <div>
                              <div className="text-[1.6rem] leading-[2rem] font-[500] text-[--white-night]">
                                {option?.shortName}
                              </div>
                              <div className="text-[1.4rem] leading-[1.6rem] font-[500] text-[--subtitle-night] mt-[0.4rem]">
                                {option?.label}
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </ListboxOption>
                  );
                })}
              </div>
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {props.hasError && <div className="error-message">{errorMessage as string}</div>}
    </div>
  );
};

export default Dropdown;
