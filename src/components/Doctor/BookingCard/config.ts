import { DAY_STATUS } from "@/common";

export const DAY_STATUS_CONFIG: Record<DAY_STATUS, { label: string; className: string }> = {
  [DAY_STATUS.AVAILABLE]: {
    label: "Làm việc",
    className: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
  },
  [DAY_STATUS.FULL]: {
    label: "Hết slot",
    className: "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100",
  },
  [DAY_STATUS.OVERTIME]: {
    label: "Làm thêm",
    className: "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100",
  },
  [DAY_STATUS.LEAVE]: {
    label: "Nghỉ phép",
    className: "bg-red-50 text-red-700 border border-red-200 line-through hover:bg-red-100",
  },
  [DAY_STATUS.DISABLED]: {
    label: "Không làm việc",
    className: "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
  },
};
