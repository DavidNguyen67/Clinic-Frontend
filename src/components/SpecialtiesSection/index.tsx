"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn, getImageUrl } from "@/lib/utils";
import { usePublicSpecialtyList } from "@/hooks/public/usePublicSpecialty";
import Autoplay from "embla-carousel-autoplay";
import { Dialog } from "@/components/ui/dialog";
import usePopup from "@/hooks/useDialog";
import SpecialtyDialog from "@/components/SpecialtyDialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useCarousel } from "@/hooks/useCarousel";

const SpecialtiesSection = () => {
  const publicSpecialtyList = usePublicSpecialtyList({ isActive: true, size: 10 });
  const popup = usePopup<{ specialtyId: string }>();
  const router = useRouter();
  const { setApi, current, count, api } = useCarousel();

  const handleCardClick = (id: string) => {
    console.log("check id", id);
    router.push(`/specialties/${id}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 mb-3">
            Specialties
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Medical Specialties</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Highly qualified doctors and modern medical equipment to support a wide range of
            healthcare services.
          </p>
        </div>

        {publicSpecialtyList.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
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
                {publicSpecialtyList.data?.body?.data?.map((specialty) => (
                  <CarouselItem key={specialty.id} className="pl-3 basis-1/2 md:basis-1/3">
                    {/* Changed from <Link> to <button> to trigger dialog */}
                    <button
                      type="button"
                      onClick={() => handleCardClick(specialty.id)}
                      className={cn(
                        "w-full h-full group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-white",
                        "border border-gray-100 hover:border-blue-200",
                        "shadow-sm hover:shadow-md transition-all duration-200",
                        "hover:-translate-y-1 cursor-pointer"
                      )}
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-50 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all">
                        <Image
                          src={getImageUrl(specialty.image)}
                          alt={specialty.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors leading-snug">
                        {specialty.name}
                      </p>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {specialty.description}
                      </p>
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

        <div className="text-center mt-8">
          <Link
            href="/specialties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-colors"
          >
            View All Specialties →
          </Link>
        </div>
      </div>

      <Dialog open={popup.open} onOpenChange={popup.onOpenChange}>
        <SpecialtyDialog specialtyId={popup.data?.specialtyId!} onOpenChange={popup.onOpenChange} />
      </Dialog>
    </section>
  );
};

export default SpecialtiesSection;
