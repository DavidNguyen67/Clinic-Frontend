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
import { useBookingStore } from "@/components/Booking/useBookingStore";

const PAGE_SIZE = 8;

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  s1: <Stethoscope className="w-6 h-6" />,
  s2: <Heart className="w-6 h-6" />,
  s3: <Activity className="w-6 h-6" />,
  s4: <Baby className="w-6 h-6" />,
  s5: <Brain className="w-6 h-6" />,
  s6: <Bone className="w-6 h-6" />,
  s7: <Eye className="w-6 h-6" />,
  s8: <Smile className="w-6 h-6" />,
};

const SPECIALTY_COLORS: Record<string, string> = {
  s1: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-300",
  s2: "bg-red-50 text-red-500 border-red-100 group-hover:bg-red-100 group-hover:border-red-300",
  s3: "bg-orange-50 text-orange-500 border-orange-100 group-hover:bg-orange-100 group-hover:border-orange-300",
  s4: "bg-green-50 text-green-600 border-green-100 group-hover:bg-green-100 group-hover:border-green-300",
  s5: "bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-100 group-hover:border-violet-300",
  s6: "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-300",
  s7: "bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-100 group-hover:border-cyan-300",
  s8: "bg-pink-50 text-pink-500 border-pink-100 group-hover:bg-pink-100 group-hover:border-pink-300",
};

export function StepSpecialty() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { store, setBookingState } = useBookingStore();

  const debouncedKeyword = useDebounce(keyword, 600);

  const publicSpecialtyList = usePublicSpecialtyList({
    isActive: true,
    page,
    size: PAGE_SIZE,
    keyword: debouncedKeyword,
  });

  const totalPages = publicSpecialtyList?.data?.body?.totalPages ?? 0;
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specialties.map((sp) => {
            const isSelected = store?.specialty?.id === sp.id;
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
                      : SPECIALTY_COLORS[sp.id]
                  )}
                >
                  {SPECIALTY_ICONS[sp.id]}
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
