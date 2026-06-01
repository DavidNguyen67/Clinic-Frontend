"use client";
import { useState, useEffect, useMemo } from "react";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  source?: string;
  url?: string;
}

interface UseFAQOptions {
  searchQuery?: string;
  activeCategory?: string;
}

interface UseFAQReturn {
  faqs: FAQItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  openId: number | null;
  toggle: (id: number) => void;
}

// FAQ tĩnh — tự kiểm soát nội dung, dễ i18n sau
const HEALTHCARE_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Huyết áp bình thường là bao nhiêu?",
    answer:
      "Huyết áp bình thường ở người lớn là dưới 120/80 mmHg. Từ 120–129/<80 mmHg là huyết áp cao bình thường. Từ 130/80 mmHg trở lên được xem là tăng huyết áp và cần theo dõi bởi bác sĩ.",
    category: "Tim mạch",
    source: "MedlinePlus",
    url: "https://medlineplus.gov/highbloodpressure.html",
  },
  {
    id: 2,
    question: "Chỉ số đường huyết bình thường là bao nhiêu?",
    answer:
      "Đường huyết lúc đói bình thường là 70–99 mg/dL (3.9–5.5 mmol/L). Từ 100–125 mg/dL là tiền tiểu đường. Từ 126 mg/dL trở lên (đo 2 lần) là tiểu đường. Nên xét nghiệm định kỳ hàng năm.",
    category: "Tiểu đường",
    source: "MedlinePlus",
    url: "https://medlineplus.gov/bloodsugar.html",
  },
  {
    id: 3,
    question: "Nên uống bao nhiêu nước mỗi ngày?",
    answer:
      "Người trưởng thành nên uống khoảng 2–2.5 lít nước mỗi ngày (8–10 ly). Nhu cầu tăng khi tập thể dục, thời tiết nóng, hoặc khi bị sốt/tiêu chảy.",
    category: "Dinh dưỡng",
    source: "WHO",
    url: "https://www.who.int/",
  },
  {
    id: 4,
    question: "Triệu chứng đột quỵ cần nhận biết sớm?",
    answer:
      "Nhớ quy tắc FAST: Face (méo miệng), Arm (yếu tay), Speech (nói khó), Time (gọi cấp cứu ngay). Thêm: đau đầu dữ dội đột ngột, mất thị lực một bên, chóng mặt mất thăng bằng. Gọi 115 ngay.",
    category: "Tim mạch",
    source: "WHO",
  },
  {
    id: 5,
    question: "Vaccine cúm có cần tiêm mỗi năm không?",
    answer:
      "Có. Virus cúm thay đổi mỗi mùa và miễn dịch từ vaccine giảm theo thời gian. WHO khuyến nghị tiêm trước mùa cúm (tháng 9–11 tại Việt Nam).",
    category: "Phòng bệnh",
    source: "WHO",
  },
  {
    id: 6,
    question: "BMI bao nhiêu là thừa cân, béo phì?",
    answer:
      "BMI = cân nặng (kg) / chiều cao² (m). Bình thường: 18.5–22.9 | Thừa cân: 23–24.9 | Béo phì I: 25–29.9 | Béo phì II: ≥30. Người châu Á dùng ngưỡng thấp hơn người phương Tây.",
    category: "Dinh dưỡng",
    source: "WHO",
  },
  {
    id: 7,
    question: "Khi nào cần đến gặp bác sĩ khẩn cấp?",
    answer:
      "Đến ngay khi: đau ngực, khó thở, mất ý thức, co giật, chảy máu không cầm, đau đầu dữ dội đột ngột, sốt cao >39.5°C kèm cứng cổ, hoặc có dấu hiệu đột quỵ (FAST).",
    category: "Khẩn cấp",
    source: "MedlinePlus",
  },
  {
    id: 8,
    question: "Ngủ bao nhiêu tiếng là đủ cho người lớn?",
    answer:
      "Người 18–64 tuổi cần 7–9 tiếng/đêm. Người trên 65 tuổi cần 7–8 tiếng. Thiếu ngủ mãn tính tăng nguy cơ tim mạch, tiểu đường và suy giảm miễn dịch.",
    category: "Sức khoẻ chung",
    source: "WHO",
  },
];

export const useFAQ = ({
  searchQuery = "",
  activeCategory = "Tất cả",
}: UseFAQOptions = {}): UseFAQReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const categories = useMemo(
    () => ["Tất cả", ...Array.from(new Set(HEALTHCARE_FAQS.map((f) => f.category)))],
    []
  );

  const faqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HEALTHCARE_FAQS.filter((f) => {
      const matchCat = activeCategory === "Tất cả" || f.category === activeCategory;
      const matchQuery =
        !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [searchQuery, activeCategory]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return { faqs, categories, isLoading, error, openId, toggle };
};
