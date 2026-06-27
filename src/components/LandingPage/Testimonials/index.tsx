"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useTranslations } from "next-intl";

import "keen-slider/keen-slider.min.css";
import { Star, MessageCircle } from "lucide-react";
import { usePublicReview } from "@/hooks/public/usePublicReview";
import { getImageUrl, getInitials } from "@/lib/utils";
import { REVIEW_STATUS } from "@/common";
import { ReviewResponse } from "@/interface/response";

const Testimonials = () => {
  const t = useTranslations("landingPage.testimonials");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { data } = usePublicReview();
  const reviews: ReviewResponse[] = [
    {
      id: "1",
      patientProfileId: "PAT001",
      patientName: "Nguyễn Văn An",
      doctorProfileId: "DOC001",
      doctorName: "TS. Trần Minh Đức",
      rating: 5,
      title: "Bác sĩ rất tận tâm",
      content:
        "Bác sĩ giải thích rất chi tiết, thăm khám cẩn thận và nhiệt tình. Tôi rất hài lòng.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=1",
      createdAt: "2026-06-20T08:30:00Z",
      updatedAt: "2026-06-20T08:30:00Z",
    },
    {
      id: "2",
      patientProfileId: "PAT002",
      patientName: "Lê Thị Mai",
      doctorProfileId: "DOC002",
      doctorName: "BS. Nguyễn Hoàng Long",
      rating: 4,
      title: "Dịch vụ tốt",
      content: "Thời gian chờ hơi lâu nhưng bác sĩ rất chuyên nghiệp và thân thiện.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=2",
      createdAt: "2026-06-21T09:15:00Z",
      updatedAt: "2026-06-21T09:15:00Z",
    },
    {
      id: "3",
      patientProfileId: "PAT003",
      patientName: "Phạm Quốc Huy",
      doctorProfileId: "DOC003",
      doctorName: "BS. Đỗ Thị Lan",
      rating: 5,
      title: "Khám rất kỹ",
      content: "Được tư vấn rõ ràng, bác sĩ thân thiện và đưa ra phác đồ điều trị phù hợp.",
      status: REVIEW_STATUS.PENDING,
      patientPathAvatar: "https://i.pravatar.cc/150?img=3",
      createdAt: "2026-06-22T13:20:00Z",
      updatedAt: "2026-06-22T13:20:00Z",
    },
    {
      id: "4",
      patientProfileId: "PAT004",
      patientName: "Trần Thu Hà",
      doctorProfileId: "DOC001",
      doctorName: "TS. Trần Minh Đức",
      rating: 3,
      title: "Ổn",
      content: "Chất lượng khám tốt nhưng cần cải thiện thời gian tiếp đón.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=4",
      createdAt: "2026-06-22T16:10:00Z",
      updatedAt: "2026-06-22T16:10:00Z",
    },
    {
      id: "5",
      patientProfileId: "PAT005",
      patientName: "Vũ Minh Quân",
      doctorProfileId: "DOC004",
      doctorName: "BS. Phạm Thu Trang",
      rating: 5,
      title: "Rất hài lòng",
      content: "Bác sĩ nhẹ nhàng, tư vấn tận tâm và theo dõi sau khám rất chu đáo.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=5",
      createdAt: "2026-06-23T08:00:00Z",
      updatedAt: "2026-06-23T08:00:00Z",
    },
    {
      id: "6",
      patientProfileId: "PAT006",
      patientName: "Đặng Hải Nam",
      doctorProfileId: "DOC002",
      doctorName: "BS. Nguyễn Hoàng Long",
      rating: 2,
      title: "Chưa hài lòng",
      content: "Thời gian chờ lâu và chưa được giải đáp hết các thắc mắc.",
      status: REVIEW_STATUS.REJECTED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=6",
      createdAt: "2026-06-23T14:45:00Z",
      updatedAt: "2026-06-23T14:45:00Z",
    },
    {
      id: "7",
      patientProfileId: "PAT007",
      patientName: "Hoàng Gia Bảo",
      doctorProfileId: "DOC005",
      doctorName: "BS. Lê Anh Tuấn",
      rating: 4,
      title: "Khá tốt",
      content: "Cơ sở vật chất sạch sẽ, bác sĩ tư vấn rõ ràng và dễ hiểu.",
      status: REVIEW_STATUS.PENDING,
      patientPathAvatar: "https://i.pravatar.cc/150?img=7",
      createdAt: "2026-06-24T10:30:00Z",
      updatedAt: "2026-06-24T10:30:00Z",
    },
    {
      id: "8",
      patientProfileId: "PAT008",
      patientName: "Ngô Thị Hương",
      doctorProfileId: "DOC003",
      doctorName: "BS. Đỗ Thị Lan",
      rating: 5,
      title: "Rất chuyên nghiệp",
      content: "Quy trình khám nhanh chóng, bác sĩ nhiệt tình và có chuyên môn cao.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=8",
      createdAt: "2026-06-25T09:40:00Z",
      updatedAt: "2026-06-25T09:40:00Z",
    },
    {
      id: "9",
      patientProfileId: "PAT009",
      patientName: "Bùi Khánh Linh",
      doctorProfileId: "DOC004",
      doctorName: "BS. Phạm Thu Trang",
      rating: 4,
      title: "Đáng trải nghiệm",
      content: "Nhân viên hỗ trợ tốt, bác sĩ tư vấn kỹ và tạo cảm giác yên tâm.",
      status: REVIEW_STATUS.APPROVED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=9",
      createdAt: "2026-06-25T15:00:00Z",
      updatedAt: "2026-06-25T15:00:00Z",
    },
    {
      id: "10",
      patientProfileId: "PAT010",
      patientName: "Đỗ Thanh Tùng",
      doctorProfileId: "DOC005",
      doctorName: "BS. Lê Anh Tuấn",
      rating: 1,
      title: "Cần cải thiện",
      content: "Trải nghiệm chưa tốt do phải chờ lâu và quá trình tư vấn khá vội.",
      status: REVIEW_STATUS.REJECTED,
      patientPathAvatar: "https://i.pravatar.cc/150?img=10",
      createdAt: "2026-06-26T11:20:00Z",
      updatedAt: "2026-06-26T11:20:00Z",
    },
  ];
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
              {reviews.map((testimonial, index) => (
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
