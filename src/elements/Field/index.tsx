import "./style.scss";

import type { ReactNode } from "react";

const Field = ({
  className,
  label,
  children,
  hasError,
  errorMessage,
  title,
  labelClassName,
  required,
}: {
  title?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  label?: string;
  children: ReactNode;
  hasError?: boolean;
  errorMessage?: string;
}) => {
  return (
    <div
      className={`field-container text-lg   ${className ?? ""}`}
      title={title ? title! : undefined}
    >
      {label && (
        <div className={`label text-color mb-10 font-semibold ${labelClassName ?? ""}`}>
          {label} {required && <sup className="text-red-600 text-lg font-semibold">*</sup>}
        </div>
      )}
      {children}
      {hasError && (
        <div className="error-message !text-[1rem] sm:text-medium sm:!text-[1.4rem]">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Field;
