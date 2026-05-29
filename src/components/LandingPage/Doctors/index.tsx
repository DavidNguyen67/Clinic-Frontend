"use client";

import React from "react";
import { Star } from "lucide-react";

import { useRouter } from "@/i18n/navigation";

const Doctors = () => {
  const router = useRouter();

  const doctors = [
    {
      id: 1,
      name: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      experience: "15 năm",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "BS. Trần Thị B",
      specialty: "Nhi khoa",
      experience: "12 năm",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      specialty: "Ngoại khoa",
      experience: "18 năm",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "BS. Phạm Thị D",
      specialty: "Sản phụ khoa",
      experience: "10 năm",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
    },
  ];
  const handleDetailDoctor = (id: number) => {
    router.push(`/en/doctor/${id}`);
  };
  return (
    <section id="doctors" className="py-20">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội ngũ bác sĩ</h2>
          <p className="text-xl text-gray-600">Bác sĩ giàu kinh nghiệm, tận tâm với nghề</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div
              onClick={() => {
                handleDetailDoctor(doctor.id);
              }}
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm">{doctor.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-blue-600 font-semibold mb-1">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">Kinh nghiệm: {doctor.experience}</p>
                <button
                  className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                  onClick={() => handleDetailDoctor(doctor.id)}
                >
                  Xem thêm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Doctors;
