"use client";

import React, { useRef } from "react";

import clsx from "clsx";

import { uuid } from "@/utils/common";

type Props = {
  className?: string;
  onClick?: () => void;
};

const CheckedIcon = (props: Props) => {
  const id = useRef(uuid());
  return (
    <svg
      className={clsx(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      onClick={props.onClick}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 14C4 8.47715 8.47715 4 14 4C15.5974 4 17.106 4.37417 18.4441 5.0392C18.6914 5.16209 18.9915 5.06125 19.1144 4.81396C19.2373 4.56667 19.1365 4.26657 18.8892 4.14368C17.4158 3.41148 15.7552 3 14 3C7.92487 3 3 7.92487 3 14C3 20.0751 7.92487 25 14 25C20.0751 25 25 20.0751 25 14C25 13.5873 24.9772 13.1797 24.9329 12.7784C24.9025 12.5039 24.6554 12.306 24.381 12.3364C24.1065 12.3667 23.9086 12.6138 23.9389 12.8883C23.9793 13.2531 24 13.624 24 14C24 19.5228 19.5228 24 14 24C8.47715 24 4 19.5228 4 14ZM24.8536 6.18689C25.0488 5.99162 25.0488 5.67504 24.8536 5.47978C24.6583 5.28452 24.3417 5.28452 24.1464 5.47978L14 15.6262L10.8536 12.4798C10.6583 12.2845 10.3417 12.2845 10.1464 12.4798C9.95118 12.675 9.95118 12.9916 10.1464 13.1869L13.6464 16.6869C13.7402 16.7807 13.8674 16.8333 14 16.8333C14.1326 16.8333 14.2598 16.7807 14.3536 16.6869L24.8536 6.18689Z"
        fill={`url(#${id.current})`}
      />
      <defs>
        <linearGradient
          id={`${id.current}`}
          x1="3"
          y1="3"
          x2="25"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FA9528" />
          <stop offset="1" stopColor="#F76F08" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CheckedIcon;
