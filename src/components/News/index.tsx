"use client";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { useCarousel } from "@/hooks/useCarousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArticlesResponse } from "@/interface/response";

interface NewsProps {
  articles: ArticlesResponse[];
}

const News = ({ articles }: NewsProps) => {
  const t = useTranslations("landingPage.news");
  const { setApi, current, count, api } = useCarousel();

  return (
    <section id="news" className="py-20">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {articles.map((article) => (
              <CarouselItem key={article.id} className="pl-3 basis-1/2 md:basis-1/3">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4 group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>
                    <button
                      className="text-blue-600 mt-auto font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                      onClick={() => window.open(article.url, "_blank")}
                    >
                      {t("readMore")} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
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
      </div>
    </section>
  );
};

export default News;
