import {
  APPOINTMENT_STATUS,
  BLOOD_TYPE,
  BOOKING_TYPE,
  EXCEPTION_TYPE,
  GENDER,
  REVIEW_STATUS,
  ROLE_NAME,
  SPECIALTY_TYPE,
  USER_STATUS,
} from "@/common";

export type BaseFilter = {
  sortDir?: "asc" | "desc";
  sortBy?: string;
  page?: number;
  size?: number;
};

export type BaseEntityResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponse = BaseEntityResponse & {
  email: string;
  fullName: string;
  phone: string;
  role: ROLE_NAME;
  gender: GENDER;
  dateOfBirth: string;
  status: USER_STATUS;
  pathAvatar: string;
  emailVerified: boolean;
  phoneVerified: boolean;

  patient?: PatientProfileResponse;
};

export type SpecialtyResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  specialtyType: SPECIALTY_TYPE;
  isActive: boolean;
};

export type DoctorProfileResponse = BaseEntityResponse & {
  user: UserResponse;
  doctorCode: string;
  specialty: SpecialtyResponse;
  degree: string;
  experienceYears: number;
  education: string;
  bio: string;
  consultationFee: number;
  averageRating: number;
  totalReviews: number;
  totalPatients: number;
  isFeatured: boolean;
  deleted: boolean;
};

export type PatientProfileResponse = BaseEntityResponse & {
  user: UserResponse;
  patientCode: string;
  address: string;
  insuranceNumber: string;
  bloodType: BLOOD_TYPE;
  allergies: string;
  chronicDiseases: string;
  loyaltyPoints: string;
  totalVisits: number;
};

export type AppointmentResponse = BaseEntityResponse & {
  appointmentCode: string;
  patientProfile: PatientProfileResponse;
  doctorProfile: DoctorProfileResponse;
  specialty: SpecialtyResponse;
  appointmentDate: string;
  appointmentTime: string;
  status: APPOINTMENT_STATUS;
  bookingType: BOOKING_TYPE;
  reason: string;
  symptoms: string;
  notes: string;
  queueNumber: number;
};

export type ReviewResponse = BaseEntityResponse & {
  patientProfile: PatientProfileResponse;
  doctorProfile: DoctorProfileResponse;
  appointment: AppointmentResponse;
  rating: number;
  title: string;
  content: string;
  status: REVIEW_STATUS;
};

export type DoctorScheduleExceptionResponse = BaseEntityResponse & {
  doctorProfile: DoctorProfileResponse;
  exceptionDate: string;
  type: EXCEPTION_TYPE;
  reason: string;
};

export type ServiceResponse = BaseEntityResponse & {
  name: string;
  slug: string;
  description: string;
  price: number;
  promotionalPrice: number;
  duration: number;
  image: string;
  isFeatured: boolean;
  isActive: boolean;
};
