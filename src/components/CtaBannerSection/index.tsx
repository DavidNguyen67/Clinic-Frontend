"use client";

import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";

const CtaBannerSection = () => {
  const badges = useRef([
    { value: "24/7", label: "Online Support" },
    { value: "< 2 min", label: "Booking Time" },
    { value: "100%", label: "Instant Confirmation" },
  ]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to book an appointment?</h2>
            <p className="text-blue-100 text-sm max-w-md">
              Don't let illness wait. Schedule today for timely consultation and treatment from our
              team of professional doctors.
            </p>
          </div>

          {/* Right — CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl gap-2 shadow-md min-w-40"
            >
              <Link href="/patient/booking">
                <CalendarCheck className="w-5 h-5" />
                Book Now
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white rounded-xl gap-2 backdrop-blur-sm min-w-40"
            >
              <a href="tel:19001234">
                <Phone className="w-5 h-5" />
                1900 1234
              </a>
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
          {badges.current.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">
                {/^\d+$/.test(value) ? <NumberFlow value={Number(value)} /> : value}
              </p>
              <p className="text-blue-200 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
