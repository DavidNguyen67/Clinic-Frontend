"use client";
import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseCarouselReturn {
  api: CarouselApi | undefined;
  setApi: (api: CarouselApi) => void;
  current: number;
  count: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export const useCarousel = (): UseCarouselReturn => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => setCurrent(api.selectedScrollSnap()));

    return () => {
      api.off("select", () => setCurrent(api.selectedScrollSnap()));
    };
  }, [api]);

  return {
    api,
    setApi,
    current,
    count,
    canScrollPrev: current > 0,
    canScrollNext: current < count - 1,
  };
};
