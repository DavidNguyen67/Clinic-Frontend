import React from "react";
import {
  Star,
  Award,
  Users,
  Video,
  Share2,
  Calendar,
  Bookmark,
  TrendingUp,
  BadgeCheck,
  Stethoscope,
  MessageCircle,
  BookmarkCheck,
} from "lucide-react";

import StatCard from "../StatCard";
import ActionButton from "../ActionButton";
import { DoctorProfileResponse } from "@/interface/response";
import { getImageUrl } from "@/lib/utils";

interface DoctorStats {
  rating: number;
  totalReviews: number;
  totalPatients: number;
  successRate: number;
  responseTime: string;
}

interface DoctorHeroProps {
  doctor: DoctorProfileResponse;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onBookAppointment: () => void;
  onVideoCall: () => void;
  onMessage: () => void;
  onShare: () => void;
}

const DoctorHeroSection: React.FC<DoctorHeroProps> = ({
  doctor,
  isBookmarked,
  onBookmarkToggle,
  onBookAppointment,
  onVideoCall,
  onMessage,
  onShare,
}) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="relative">
            <img
              src={getImageUrl(doctor?.user?.pathAvatar)}
              alt={doctor.user?.fullName}
              className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-2xl"
            />
            {doctor.availableToday && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Có lịch hôm nay
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold">
                    {doctor.degree}
                  </span>
                  <span className="bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    Đã xác thực
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2">{doctor.user?.fullName}</h1>
                <div className="flex items-center gap-4 text-blue-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    <span className="text-lg font-semibold">{doctor.specialty?.name}</span>
                  </div>
                  {/*{doctor.subSpecialty && (*/}
                  {/*  <>*/}
                  {/*    <div className="w-1 h-1 bg-blue-100 rounded-full" />*/}
                  {/*    <span>{doctor.subSpecialty}</span>*/}
                  {/*  </>*/}
                  {/*)}*/}
                </div>
              </div>

              <button
                onClick={onBookmarkToggle}
                className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-6 h-6" />
                ) : (
                  <Bookmark className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard
                icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                value={doctor.averageRating}
                label={`${doctor.totalReviews} đánh giá`}
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                value={doctor.totalPatients}
                label="Bệnh nhân"
              />
              <StatCard
                icon={<Award className="w-5 h-5" />}
                value={doctor.experienceYears}
                label="Năm kinh nghiệm"
              />
              {/*<StatCard*/}
              {/*  icon={<TrendingUp className="w-5 h-5" />}*/}
              {/*  value={`${doctor.stats.successRate}%`}*/}
              {/*  label="Thành công"*/}
              {/*/>*/}
              {/*<StatCard*/}
              {/*  icon={<MessageCircle className="w-5 h-5" />}*/}
              {/*  value={doctor.stats.responseTime}*/}
              {/*  label="Phản hồi"*/}
              {/*/>*/}
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
              <ActionButton
                onClick={onBookAppointment}
                icon={<Calendar className="w-5 h-5" />}
                variant="primary"
              >
                Đặt lịch khám
              </ActionButton>
              <ActionButton onClick={onVideoCall} icon={<Video className="w-5 h-5" />}>
                Tư vấn video
              </ActionButton>
              <ActionButton onClick={onMessage} icon={<MessageCircle className="w-5 h-5" />}>
                Nhắn tin
              </ActionButton>
              <button
                onClick={onShare}
                className="p-3 bg-white/20 backdrop-blur text-white rounded-full hover:bg-white/30 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DoctorHeroSection;
