import {
  APPOINTMENT_STATUS,
  BLOOD_TYPE,
  BOOKING_TYPE,
  CONVERSATION_TYPE,
  EXCEPTION_TYPE,
  GENDER,
  INVOICE_ITEM_TYPE,
  INVOICE_STATUS,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
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
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  deleted?: boolean;
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
  doctor?: DoctorProfileResponse;
  staff?: StaffProfileResponse;
};

export type StaffProfileResponse = BaseEntityResponse & {
  staffCode: string;
  position: string;
  department: string;
  hireDate: string; // HH:mm:ss dd/MM/yyyy
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

  reviewed: boolean;

  // format: "16:00:00 15/05/2026"
  appointmentDate: string;

  appointmentTime: string;

  status: APPOINTMENT_STATUS;

  bookingType: BOOKING_TYPE;

  reason: string;
  symptoms: string;
  notes: string;

  queueNumber: number | null;

  patientProfileId: string;
  patientName: string;

  doctorProfileId: string;
  doctorName: string;
  doctorPathAvatar: string | null;

  specialtyId: string;
  specialtyName: string;

  invoices: InvoiceResponse[] | null;

  clinicServices: ClinicServiceResponse[];

  fee: number;
};

export type ClinicServiceResponse = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  name: string;
  slug: string;
  description: string;

  price: number;
  promotionalPrice: number | null;

  duration: number;

  image: string;

  isFeatured: boolean;
  isActive: boolean;
  deleted: boolean;
};

export type ReviewResponse = BaseEntityResponse & {
  patientProfileId: string;
  patientName: string;
  doctorProfileId: string;
  doctorName: string;
  rating: number;
  title: string;
  content: string;
  status: REVIEW_STATUS;
  patientPathAvatar?: string;
};

export type ReviewDetailsResponse = BaseEntityResponse & {};

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

export type InvoiceResponse = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  invoiceCode: string;

  patientProfile: PatientProfileResponse;

  invoiceDate: string; // "dd/MM/yyyy" per @JsonFormat

  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  insuranceCovered: number;
  patientPaid: number;
  balance: number;

  status: INVOICE_STATUS;

  items: InvoiceItemResponse[];

  deleted: boolean;
};

export type InvoiceItemResponse = {
  id: string;

  createdAt: string;
  itemName: string;
  updatedAt: string | null;
  deletedAt: string | null;

  serviceName: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  deleted: boolean;
  itemType: INVOICE_ITEM_TYPE;
};

export type AppointmentStatisticsResponse = {
  todayCount: number;
  upcomingCount: number;

  pendingCount: number;
  confirmedCount: number;
  checkedInCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
};

export type ConversationResponse = BaseEntityResponse & {
  participants: string[];
  type: CONVERSATION_TYPE;
  name: string;
  avatar: string;
  lastMessage?: LastMessageResponse;
};

export type LastMessageResponse = BaseEntityResponse & {
  senderId: string;
  content: string;
  sentAt: Date;
  type: MESSAGE_TYPE;
};

export type MessageResponse = BaseEntityResponse & {
  conversationId: string;
  senderId: string;
  content: string;
  type: MESSAGE_TYPE;
  status: MESSAGE_STATUS;
  readBy: string[];
  replyTo?: string;
};
