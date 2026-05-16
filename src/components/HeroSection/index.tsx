"use client";
import { Calendar, ChevronRight, Star, Users, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import NumberFlow from "@number-flow/react";
import { usePublicUserStatistics } from "@/hooks/public/usePublicUser";
import { usePublicSpecialtyStatistics } from "@/hooks/public/usePublicSpecialty";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const publicUserStatistics = usePublicUserStatistics();
  const publicSpecialtyStatistics = usePublicSpecialtyStatistics();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // chỉ trigger 1 lần
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rating = 4.9;

  const statistics = [
    { icon: Users, value: publicUserStatistics?.data?.body?.patientsCount, label: "Patients" },
    { icon: Stethoscope, value: publicUserStatistics?.data?.body?.doctorsCount, label: "Doctors" },
    {
      icon: Stethoscope,
      value: publicSpecialtyStatistics?.data?.body?.totalSpecialties,
      label: "Specialties",
    },
  ];

  // base classes cho animate items
  const base = "transition-all duration-700 ease-out";
  const hidden = "opacity-0 translate-y-6";
  const shown = "opacity-100 translate-y-0";

  return (
    <section
      ref={sectionRef}
      className="bg-linear-to-br from-blue-600 via-blue-700 to-teal-600 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ── Left ── */}
          <div>
            {/* Badge */}
            <div
              className={`${base} ${visible ? shown : hidden}`}
              style={{ transitionDelay: "0ms" }}
            >
              <Badge
                variant="secondary"
                className="bg-white/20 hover:bg-white/20 text-white border-0 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6 inline-flex gap-2"
              >
                🏥 MedCare General Clinic
              </Badge>
            </div>

            {/* Heading */}
            <h1
              className={`text-4xl md:text-5xl font-bold text-white mb-6 leading-tight ${base} ${visible ? shown : hidden}`}
              style={{ transitionDelay: "100ms" }}
            >
              Book Your Appointment
              <br />
              <span className="text-yellow-300">Quickly</span> &
              <br />
              Conveniently
            </h1>

            {/* Description */}
            <p
              className={`text-blue-100 text-lg mb-8 leading-relaxed ${base} ${visible ? shown : hidden}`}
              style={{ transitionDelay: "200ms" }}
            >
              Online medical appointment booking system. Choose your doctor, select a suitable time,
              and receive instant confirmation.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-3 ${base} ${visible ? shown : hidden}`}
              style={{ transitionDelay: "300ms" }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-200 font-semibold rounded-xl gap-2 shadow-md"
              >
                <Link href="/patient/booking">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white rounded-xl gap-2 backdrop-blur-sm"
              >
                <Link href="/doctors">
                  View Doctors
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20 ${base} ${visible ? shown : hidden}`}
              style={{ transitionDelay: "400ms" }}
            >
              {statistics.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <p className="text-2xl font-bold text-white">
                    {/* NumberFlow chỉ count up khi visible = true */}
                    <NumberFlow value={visible ? Number(value ?? 0) : 0} />
                  </p>
                  <p className="text-blue-200 text-sm flex items-center gap-1">
                    <Icon className="w-4 h-4 text-blue-200 mb-0.5" />
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right ── */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Image */}
              <div
                className={`${base} ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1764727291644-5dcb0b1a0375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                  alt="MedCare Clinic"
                  className="rounded-2xl shadow-2xl object-cover w-full h-80"
                />
              </div>

              {/* Floating card - bottom left */}
              <div
                className={`absolute -bottom-4 -left-4 ${base} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "500ms" }}
              >
                <Card className="shadow-xl border-0">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Appointment Confirmed</p>
                      <p className="text-xs text-gray-500">Confirmation via Email/SMS</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating card - top right */}
              <div
                className={`absolute -top-4 -right-4 ${base} ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                style={{ transitionDelay: "600ms" }}
              >
                <Card className="shadow-xl border-0">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">
                      <NumberFlow value={visible ? rating : 0} /> / 5.0
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
