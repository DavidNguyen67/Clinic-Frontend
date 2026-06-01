"use client";
import { useState } from "react";
import {
  ChevronDown,
  Search,
  ExternalLink,
  AlertCircle,
  Info,
  MessageCircle,
  LayoutGrid,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { useFAQ } from "@/hooks/useFAQ";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import NumberFlow from "@number-flow/react";
import { Link } from "@/i18n/navigation";

const CATEGORY_COLORS: Record<string, string> = {
  "Tim mạch": "bg-red-400",
  "Tiểu đường": "bg-amber-400",
  "Dinh dưỡng": "bg-green-400",
  "Phòng bệnh": "bg-teal-400",
  "Khẩn cấp": "bg-orange-400",
  "Sức khoẻ chung": "bg-blue-400",
};

const STATS: { icon: React.ReactNode; value: number | string; label: string }[] = [
  { icon: <MessageCircle className="w-5 h-5" />, value: 8, label: "Câu hỏi thường gặp" },
  { icon: <LayoutGrid className="w-5 h-5" />, value: 5, label: "Chủ đề sức khoẻ" },
  { icon: <ShieldCheck className="w-5 h-5" />, value: "WHO", label: "Nguồn kiểm chứng" },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const debouncedKeyword = useDebounce(searchQuery, 600);

  const { faqs, categories, openId, toggle } = useFAQ({
    searchQuery: debouncedKeyword,
    activeCategory,
  });

  return (
    <section id="faq" className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex justify-center text-blue-500 mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">
                {typeof s.value === "number" ? <NumberFlow value={s.value} /> : s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Thông tin dưới đây mang tính tham khảo. Hãy gặp bác sĩ để được tư vấn chính xác cho tình
            trạng của bạn.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition",
                activeCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <p>Không tìm thấy câu hỏi phù hợp</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={cn(
                  "border rounded-2xl bg-white overflow-hidden transition-all",
                  openId === faq.id ? "border-blue-200 shadow-sm" : "border-gray-100"
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => toggle(faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        CATEGORY_COLORS[faq.category] ?? "bg-gray-400"
                      )}
                    />
                    <span className="font-medium text-gray-900 text-sm leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
                      openId === faq.id && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-200",
                    openId === faq.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                      {faq.source && (
                        <Link
                          href={faq.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-xs text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Nguồn: {faq.source}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotline */}
        <div className="mt-8 flex items-center gap-4 border border-gray-100 rounded-2xl bg-white p-5">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Đường dây hỗ trợ y tế khẩn cấp</p>
            <p className="text-xs text-gray-500 mt-0.5">Hoạt động 24/7 · Miễn phí</p>
          </div>
          <Link
            href="tel:115"
            className="ml-auto text-2xl font-bold text-red-500 hover:text-red-600 transition"
          >
            115
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
