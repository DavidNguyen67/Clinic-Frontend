"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useTranslations } from "next-intl";

import "keen-slider/keen-slider.min.css";
import { Star, MessageCircle } from "lucide-react";
import { usePublicReview } from "@/hooks/public/usePublicReview";
import { getImageUrl, getInitials } from "@/lib/utils";

const Testimonials = () => {
  const t = useTranslations("landingPage.testimonials");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { data } = usePublicReview();

  const testimonials = data?.body?.data || [];

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
  });
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </div>

        {testimonials.length > 0 && (
          <div className="relative bg-white rounded-2xl shadow-xl p-12">
            <MessageCircle className="absolute top-8 left-8 w-12 h-12 text-blue-600 opacity-20" />

            <div ref={sliderRef} className="keen-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="keen-slider__slide">
                  <div className="flex items-center gap-2 mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl text-gray-700 text-center mb-8 italic">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {testimonial.patientPathAvatar ? (
                      <img
                        src={getImageUrl(testimonial.patientPathAvatar)}
                        alt={testimonial.patientName}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                        {getInitials(testimonial.patientName)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.patientName}</div>
                      <div className="text-sm text-gray-500">{t("patientLabel")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {loaded && instanceRef.current && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => instanceRef.current?.moveToIdx(index)}
                    className={`w-3 h-3 rounded-full transition ${index === currentSlide ? "bg-blue-600 w-8" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export default Testimonials;
