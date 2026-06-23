"use client";
import React from "react";
import clsx from "clsx";
import { CircleSlash2 } from "lucide-react";

interface NoRowsOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const NoRowsOverlay = (props: NoRowsOverlayProps) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex flex-col flex-1 items-center justify-center h-full py-[2rem] 2xl:py-[3rem] mt-[5rem]",
        props.className
      )}
    >
      <CircleSlash2 className="w-[6rem] h-[6rem]" />
      <div className="text-[#898BAB] text-[1.4rem] font-[500]">No data available</div>
    </div>
  );
};

export default NoRowsOverlay;
