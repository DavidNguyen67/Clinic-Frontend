"use client";

import React, { useState } from "react";

import AboutTab from "@/components/Doctor/AboutTab";
import DoctorTabs from "@/components/Doctor/DoctorTabs";
import ReviewsTab from "@/components/Doctor/ReviewsTab";
import BookingCard from "@/components/Doctor/BookingCard";
import ExpertiseTab from "@/components/Doctor/ExpertiseTab";
import EducationTab from "@/components/Doctor/EducationTab";
import DoctorBreadcrumb from "@/components/Doctor/Breadcrumb";
import DoctorHeroSection from "@/components/Doctor/DoctorHeroSection";

import RelatedDoctors from "./RelatedDoctors";
import { reviewsData, relatedDoctorsData } from "./config";
import { useParams } from "next/navigation";
import { usePublicDoctorById } from "@/hooks/public/usePublicDoctor";

const DetailDoctor = () => {
  const [activeTab, setActiveTab] = useState("about");
  const { doctorProfileId } = useParams<{ doctorProfileId: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data } = usePublicDoctorById(doctorProfileId);

  const doctorData = data?.body;

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Bác sĩ", href: "/bac-si" },
    { label: "Tim mạch", href: "/bac-si?specialty=tim-mach" },
    { label: doctorData?.user?.fullName ?? "", href: "/user" },
  ];

  const handleBookAppointment = () => {
    console.log("Book appointment");
    // Navigate to booking page or open modal
  };

  const handleVideoCall = () => {
    console.log("Video call");
  };

  const handleMessage = () => {
    console.log("Message");
  };

  const handleShare = () => {
    console.log("Share");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <DoctorBreadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <DoctorHeroSection
        doctor={doctorData!}
        isBookmarked={isBookmarked}
        onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
        onBookAppointment={handleBookAppointment}
        onVideoCall={handleVideoCall}
        onMessage={handleMessage}
        onShare={handleShare}
      />

      {/* Main Content */}
      <div className="max-w-[100rem] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Tabs Content */}
          <div className="lg:col-span-2">
            <DoctorTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-white rounded-b-2xl shadow-lg">
              {activeTab === "about" && (
                <AboutTab
                  treatmentApproach={doctorData.treatmentApproach}
                  languages={doctorData.languages}
                  awards={doctorData.awards}
                  publications={doctorData.publications}
                  doctorName={doctorData.name}
                />
              )}

              {activeTab === "expertise" && (
                <ExpertiseTab
                  expertise={doctorData.expertise}
                  certificates={doctorData.certificates}
                  doctorName={doctorData.name}
                />
              )}

              {activeTab === "education" && (
                <EducationTab
                  education={doctorData.education}
                  workHistory={doctorData.workHistory}
                />
              )}

              {activeTab === "reviews" && (
                <ReviewsTab
                  rating={doctorData.stats.rating}
                  totalReviews={doctorData.stats.totalReviews}
                  reviews={reviewsData}
                  showAll={showAllReviews}
                  onToggleShowAll={() => setShowAllReviews(!showAllReviews)}
                />
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            <BookingCard
              pricing={doctorData.pricing}
              workingDays={doctorData.workingDays}
              workingHours={doctorData.workingHours}
              timeSlots={doctorData.timeSlots}
              location={doctorData.location}
              hotline="1900-xxxx"
              onBookAppointment={handleBookAppointment}
              onVideoCall={handleVideoCall}
            />
          </div>
        </div>
        <div className="mt-[1rem]">
          <RelatedDoctors doctors={relatedDoctorsData} />
        </div>
      </div>
    </div>
  );
};
export default DetailDoctor;
