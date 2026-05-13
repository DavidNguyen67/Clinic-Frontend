"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn, formatCurrency, formatNumber, getImageUrl } from "@/lib/utils";
import { usePublicDoctorList } from "@/hooks/public/usePublicDoctor";
import DoctorDialog from "../DoctorDialog";

const FeaturedDoctorsSection = () => {
  const publicDoctorList = usePublicDoctorList({ isFeatured: true });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Dialog state
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const handleCardClick = (id: string) => {
    setSelectedDoctorId(id);
    setDialogOpen(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50 mb-3">
              Our Doctors
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Doctors</h2>
            <p className="text-gray-500 text-sm">Top-rated doctors at MedCare</p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        {publicDoctorList.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <Skeleton className="h-8 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {publicDoctorList.data?.body?.data?.map((doctor) => (
                  <CarouselItem key={doctor.id} className="pl-3 basis-1/2 md:basis-1/4">
                    {/* button instead of Link — opens dialog */}
                    <button
                      type="button"
                      className="w-full h-full text-left"
                      onClick={() => handleCardClick(doctor.id)}
                    >
                      <Card className="group border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-2xl overflow-hidden h-full cursor-pointer">
                        {/* Avatar */}
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden">
                          <Image
                            src={getImageUrl(doctor?.user?.pathAvatar)}
                            alt={doctor.user.fullName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Rating badge */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-semibold text-gray-700">
                              {formatNumber(doctor.averageRating)} (
                              {formatNumber(doctor.totalReviews)})
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-4 flex flex-col gap-2">
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs bg-blue-50 text-blue-600 hover:bg-blue-50"
                          >
                            {doctor.specialty.name}
                          </Badge>

                          <div>
                            <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                              {doctor.degree}. {doctor.user.fullName}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {formatNumber(doctor.experienceYears)} years
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatNumber(doctor.totalPatients)}
                            </span>
                          </div>

                          <div className="mt-1 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Consultation Fee</span>
                            <span className="text-sm font-bold text-teal-600">
                              {formatCurrency(doctor.consultationFee)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === current ? "w-6 bg-blue-500" : "w-1.5 bg-gray-200 hover:bg-gray-300"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* View all */}
        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Link href="/doctors">View All Doctors →</Link>
          </Button>
        </div>
      </div>

      {/* Doctor Dialog */}
      <DoctorDialog doctorId={selectedDoctorId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default FeaturedDoctorsSection;
