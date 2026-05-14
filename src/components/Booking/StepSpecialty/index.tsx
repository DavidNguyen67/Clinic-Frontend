"use client";

import { useState } from "react";
import {
  Search,
  Check,
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Brain,
  Bone,
  Eye,
  Smile,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SpecialtyResponse } from "@/interface/response";
import { usePublicSpecialtyList } from "@/hooks/public/usePublicSpecialty";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SPECIALTY_COLORS,
  SPECIALTY_ICONS,
  useBookingStore,
} from "@/components/Booking/useBookingStore";

const PAGE_SIZE = 8;

export function StepSpecialty() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { store, setBookingState } = useBookingStore();

  const debouncedKeyword = useDebounce(keyword, 600);

  const publicSpecialtyList = usePublicSpecialtyList({
    isActive: true,
    page: page - 1,
    size: PAGE_SIZE,
    keyword: debouncedKeyword,
  });

  const totalPages = publicSpecialtyList?.data?.body?.totalPages
    ? publicSpecialtyList?.data?.body?.totalPages - 1
    : 0;
  const specialties = publicSpecialtyList?.data?.body?.data ?? [];
  const isLoading = publicSpecialtyList.isLoading;

  const handleSelect = (sp: SpecialtyResponse) => {
    setBookingState({ specialty: sp, doctor: undefined });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Choose a Specialty</h2>
        <p className="text-sm text-gray-400 mt-1">
          Select the medical specialty that best matches your needs
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search specialty..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-9 rounded-xl border-gray-200 focus-visible:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : specialties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Stethoscope className="w-7 h-7 text-blue-500" />
          </div>

          <h3 className="text-sm font-semibold text-gray-900">No specialties found</h3>

          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            {keyword
              ? `No specialties match "${keyword}". Try another keyword.`
              : "There are currently no specialties available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specialties.map((sp) => {
            const isSelected = store?.specialty?.id === sp.id;
            const Icon = SPECIALTY_ICONS[sp?.specialtyType!] ?? undefined;
            return (
              <button
                key={sp.id}
                onClick={() => handleSelect(sp)}
                className={cn(
                  "group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-center cursor-pointer",
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200",
                    isSelected
                      ? "bg-blue-100 text-blue-600 border-blue-200"
                      : SPECIALTY_COLORS[sp.specialtyType!]
                  )}
                >
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected ? "text-blue-700" : "text-gray-800"
                    )}
                  >
                    {sp.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{sp.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {totalPages > 1 && !keyword && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage((p) => p - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pg = i + 1;
              if (pg === 1 || pg === totalPages || Math.abs(pg - page) <= 1) {
                return (
                  <PaginationItem key={pg}>
                    <PaginationLink
                      href="#"
                      isActive={pg === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pg);
                      }}
                    >
                      {pg}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (pg === page - 2 || pg === page + 2) {
                return (
                  <PaginationItem key={pg}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage((p) => p + 1);
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
