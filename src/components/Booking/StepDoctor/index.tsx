"use client";

import { useState } from "react";
import { Star, User, Check, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn, getImageUrl, getInitials } from "@/lib/utils";
import { DoctorProfileResponse } from "@/interface/response";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { usePublicDoctorList } from "@/hooks/public/usePublicDoctor";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 3;

export function StepDoctor() {
  const [page, setPage] = useState(1);

  const { store, setBookingState } = useBookingStore();

  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 600);

  const publicDoctorList = usePublicDoctorList({
    page,
    specialtyId: store?.specialty?.id,
    size: PAGE_SIZE,
    fullName: debouncedKeyword,
  });

  const handleSelect = (doc: DoctorProfileResponse) => {
    setBookingState({ doctor: doc });
  };

  const doctors = publicDoctorList.data?.body?.data ?? [];
  const totalPages = publicDoctorList.data?.body?.totalPages ?? 0;
  const isLoading = publicDoctorList.isLoading;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Choose a Doctor</h2>
        <p className="text-sm text-gray-400 mt-1">
          {store?.specialty
            ? `Showing doctors for ${store.specialty.name}`
            : "All available doctors"}
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

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          : doctors.map((doc) => {
              const isSelected = store?.doctor?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => handleSelect(doc)}
                  className={cn(
                    "w-full text-left flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  <Avatar className="w-14 h-14 shrink-0 rounded-xl">
                    <AvatarImage
                      src={doc.user?.pathAvatar ? getImageUrl(doc.user?.pathAvatar) : undefined}
                      alt={doc.user?.fullName}
                    />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                      {getInitials(doc.user?.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{doc.user.fullName}</p>
                        <p className="text-xs text-gray-400">
                          {doc.degree} · {doc.experienceYears} yrs exp
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                          {doc.averageRating}
                        </span>
                        <span className="text-xs text-gray-400">({doc.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        {doc.totalPatients.toLocaleString()} patients
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1.5 border-green-200 text-green-600 bg-green-50"
                      >
                        Available today
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">{doc.education}</p>
                      <p className="text-sm font-bold text-blue-600">
                        {doc.consultationFee.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
      </div>

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
