# AGENTS.md

## Project Overview

> Hệ thống đặt lịch khám bệnh trực tuyến — hỗ trợ 3 vai trò: **Patient**, **Doctor**, **Staff**.
> Tính năng chính: đặt lịch theo bước, quản lý cuộc hẹn, chat, hóa đơn, hồ sơ bác sĩ/bệnh nhân.

---

## Tech Stack

| Nhóm          | Thư viện                          | Version          |
| ------------- | --------------------------------- | ---------------- |
| Framework     | Next.js                           | 16.2.6           |
| Language      | TypeScript                        | ^5               |
| React         | React                             | 19.2.4           |
| UI            | shadcn/ui + radix-ui              | ^4.7.0 / ^1.4.3  |
| Styling       | Tailwind CSS                      | ^4               |
| i18n          | next-intl                         | ^4.12.0          |
| Forms         | Formik + Yup                      | ^2.4.9 / ^1.7.1  |
| Data fetching | SWR + Axios                       | ^2.4.1 / ^1.16.0 |
| Date          | date-fns                          | ^4.1.0           |
| Charts        | Recharts                          | 3.8.0            |
| PDF           | @react-pdf/renderer               | ^4.5.1           |
| WebSocket     | @stomp/stompjs + sockjs-client    | ^7.3.0 / ^1.6.1  |
| Carousel      | Embla Carousel                    | ^8.6.0           |
| Virtual list  | @tanstack/react-virtual           | ^3.13.24         |
| Notifications | Sonner                            | ^2.0.7           |
| Utilities     | lodash, clsx, tailwind-merge, cva | latest           |
| Icons         | lucide-react                      | ^1.14.0          |

---

## Project Structure

```
src/
├── app/
│   ├── api/                        # API routes (e.g. /api/health)
│   └── [locale]/                   # i18n root — mọi page đều nằm trong đây
│       ├── (auth)/auth/            # Login, Register, Forgot Password
│       ├── (authenticated)/        # Các route cần đăng nhập
│       │   ├── doctor/             # Appointments, Patients, Profile
│       │   ├── patient/            # Appointments, Booking, Messages, Profile
│       │   └── staff/              # Appointments, Invoices, Profile
│       └── (public)/               # Không cần đăng nhập
│           ├── doctors/[doctorProfileId]/
│           ├── faq/
│           └── specialties/[specialtyId]/
│
├── components/
│   ├── ui/                         # shadcn/ui — KHÔNG sửa trực tiếp
│   │
│   │   # === FEATURE COMPONENTS (theo domain) ===
│   ├── Booking/                    # Stepper đặt lịch (StepBar, StepDoctor, StepSchedule...)
│   ├── Appointments/               # Patient appointments (Card, Drawer, Reschedule...)
│   ├── AppoinmentManagement/       # Staff appointment management
│   ├── DoctorAppointments/         # Doctor-side appointments (List, Sidebar, TopBar)
│   ├── DoctorDashboard/            # Dashboard bác sĩ (Chart, Stats, Notifications...)
│   ├── DoctorProfile/              # Hồ sơ bác sĩ (Bio, Fee, ProfessionalInfo...)
│   ├── Doctor/                     # Public doctor detail page (Hero, Tabs, Reviews...)
│   ├── PatientProfile/             # Hồ sơ bệnh nhân
│   ├── StaffProfile/               # Hồ sơ nhân viên
│   ├── InvoiceManagement/          # Quản lý hóa đơn (Table, PaidForm, UpdateStatus...)
│   ├── Chat/                       # Nhắn tin (ConversationList, MessagePanel)
│   ├── SpecialistDetails/          # Trang chi tiết chuyên khoa
│   ├── LandingPage/                # Landing page sections (Banner, Doctors, Footer...)
│   └── Landing/                    # Doctor list filter + grid
│
├── hooks/
│   ├── auth/                       # useAuth, useSession...
│   ├── common/                     # Shared hooks
│   ├── doctor/                     # Doctor-specific hooks
│   ├── patient/                    # Patient-specific hooks
│   ├── public/                     # Public page hooks
│   └── staff/                      # Staff-specific hooks
│
├── interface/                      # TypeScript interfaces / types toàn project
├── lib/                            # Utils, helpers (cn, formatDate...)
├── i18n/                           # next-intl config & routing
├── locales/                        # Translation files (vi.json, en.json...)
├── common/                         # Shared constants, enums
└── providers/                      # React context providers
```

---

## Routing & i18n

Tất cả pages đều nằm trong `app/[locale]/` — next-intl xử lý i18n.

```
/en/auth/login         → app/[locale]/(auth)/auth/login/page.tsx
/vi/patient/booking    → app/[locale]/(authenticated)/patient/booking/page.tsx
/en/doctors/abc-123    → app/[locale]/(public)/doctors/[doctorProfileId]/page.tsx
```

- Dùng `useTranslations()` hook ở Client Components
- Dùng `getTranslations()` ở Server Components
- Translation files ở `src/locales/`

---

## Role-based Architecture

Project có 3 role với layout & feature riêng biệt:

| Role    | Route prefix | Chức năng chính                             |
| ------- | ------------ | ------------------------------------------- |
| Patient | `/patient/`  | Đặt lịch, xem appointments, nhắn tin, hồ sơ |
| Doctor  | `/doctor/`   | Quản lý lịch hẹn, dashboard, hồ sơ          |
| Staff   | `/staff/`    | Quản lý appointments, hóa đơn, hồ sơ        |

---

## Component Conventions

### Đặt component ở đâu?

- **shadcn primitive** → `components/ui/` (không tạo thêm, không sửa)
- **Thuộc về 1 feature/domain** → folder tương ứng, ví dụ `components/Booking/StepSchedule/`
- **Dùng chung nhiều nơi** → `components/` root (ví dụ `Header`, `LoginForm`)
- **Hook** → `hooks/[role]/` hoặc `hooks/common/`
- **Type/Interface** → `interface/`

### Naming

- Component: **PascalCase**, named export
- Hook: `use` prefix, camelCase — `useAppointments.ts`
- Util: camelCase — `formatDate.ts`
- Types: trong `interface/` folder

```typescript
// ✅
export function AppointmentCard({ appointment }: AppointmentCardProps) { ... }

// ❌
export default function ({ data }: any) { ... }
```

### Styling

- Dùng `cn()` từ `@/lib/utils`
- Không inline style trừ dynamic value
- Variants → dùng `cva()`

---

## Coding Conventions

### TypeScript

- `interface` cho object types, `type` cho unions/intersections
- Không dùng `any` — dùng `unknown` nếu cần
- Tất cả types/interfaces đặt trong `src/interface/`

### Server vs Client

- Mặc định **Server Component** — không `"use client"`
- Chỉ thêm `"use client"` khi dùng: hooks, event handlers, browser APIs
- Sub-components trong cùng feature folder có thể là Client nếu cần

### Forms — Formik + Yup

```typescript
const schema = yup.object({ email: yup.string().email().required() });
type FormData = yup.InferType<typeof schema>;
// Schema + type tách ra config.ts cùng folder
```

---

## Booking Flow (Multi-step)

Booking là feature phức tạp nhất — stepper gồm các bước:

```
StepSpecialty → StepDoctor → StepSchedule → StepDetails → StepReview → StepSuccess
```

Tất cả step components trong `components/Booking/`. `StepBar` hiển thị progress.

---

## Do NOT

- ❌ Sửa file trong `components/ui/` của shadcn
- ❌ Dùng `pages/` directory
- ❌ Dùng `getServerSideProps` / `getStaticProps`
- ❌ Hardcode string nếu có trong locales
- ❌ Tạo component ở sai folder (xem "Đặt component ở đâu?" ở trên)
- ❌ Bỏ qua i18n — mọi text hiển thị đều phải qua translation

---

## Notes for AI

- Mọi page đều nằm trong `app/[locale]/` — không bao giờ tạo page ngoài segment này
- Khi tạo component mới, đặt vào đúng folder domain theo cấu trúc hiện có
- Booking flow là multi-step — khi sửa phải biết đang ở step nào
- 3 role (patient/doctor/staff) có route, layout, component riêng — không mix
- Check `interface/` trước khi định nghĩa type mới
- Hooks phân theo role trong `hooks/[role]/`

---

## Code Style (học từ codebase thực tế)

### Forms — dùng Formik + Yup/Zod (KHÔNG dùng React Hook Form)

```typescript
"use client";
import { useFormik } from "formik";
import { LoginFormValues, loginSchema } from "./config"; // schema + type tách ra file config.ts

const formik = useFormik<LoginFormValues>({
  initialValues,
  validationSchema: loginSchema,
  onSubmit: async (values, formikHelpers) => {
    try {
      await someAction(values);
    } catch (error) {}
    formikHelpers.setSubmitting(false); // luôn reset submitting trong finally
  },
});

// Bind field
<Input {...formik.getFieldProps("email")} />

// Error display
{formik.touched.email && formik.errors.email && (
  <FieldDescription className="text-red-500">{formik.errors.email}</FieldDescription>
)}
```

Schema và type đặt trong file `config.ts` cùng folder với component:

```typescript
// config.ts
export const loginSchema = yup.object({ ... })
export type LoginFormValues = yup.InferType<typeof loginSchema>
```

### Data Fetching — dùng SWR wrapper (KHÔNG dùng TanStack Query)

```typescript
import { useSWRWrapper } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { buildQueryParams } from "@/lib/utils";

export const usePublicReview = (filter?: BaseFilter & { doctorProfileId?: string }) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<ReviewResponse>>(`/api/v1/public/review?${query}`, {
    url: `/api/v1/public/review?${query}`,
    method: METHOD.GET,
  });
};
```

Pattern cố định:

- Key SWR = URL đầy đủ kể cả query string
- Filter object → `buildQueryParams()` từ `@/lib/utils`
- Response type: `ApiPagedResponse<T>` cho list, `T` cho single item
- Hooks đặt trong `hooks/[role]/` hoặc `hooks/public/`

### UI Components — Field pattern của shadcn custom

Project dùng `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription` (custom shadcn):

```typescript
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" ... />
    <FieldDescription className="text-red-500">{error}</FieldDescription>
  </Field>
</FieldGroup>
```

### Navigation — dùng i18n wrapper (KHÔNG dùng next/navigation trực tiếp)

```typescript
// ✅ Đúng
import { Link, useRouter } from "@/i18n/navigation";

// ❌ Sai
import { useRouter } from "next/navigation";
import Link from "next/link";
```

### Types & Interfaces

Tất cả response types đã định nghĩa trong `src/interface/response.ts`:

- `BaseEntityResponse` — base cho mọi entity (id, createdAt, updatedAt, deletedAt)
- `BaseFilter` — base cho filter params (page, size, sortBy, sortDir)
- `ApiPagedResponse<T>` — wrapper cho paginated list
- `UserResponse`, `DoctorProfileResponse`, `PatientProfileResponse`, `StaffProfileResponse`
- `AppointmentResponse`, `InvoiceResponse`, `ReviewResponse`, `MessageResponse`...

**Luôn check `interface/response.ts` trước khi định nghĩa type mới.**

Enums/constants import từ `@/common`:

```typescript
import { APPOINTMENT_STATUS, BOOKING_TYPE, ROLE_NAME, ... } from "@/common";
```

### Component Structure Pattern

```typescript
"use client"; // chỉ khi cần

// 1. Imports: thư viện → internal utils → components → hooks → types/config
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { LoginFormValues } from "./config";

// 2. Props interface
interface MyComponentProps extends React.ComponentProps<"div"> {
  // custom props
}

// 3. Named export function
export function MyComponent({ className, ...props }: MyComponentProps) {
  // hooks trước
  // handlers sau
  // return JSX
}
```

---

## Updated Do NOT

- ❌ Dùng React Hook Form — project dùng **Formik**
- ❌ Dùng TanStack Query — project dùng **SWR** qua `useSWRWrapper`
- ❌ Import `useRouter`, `Link` từ `next/navigation` — dùng `@/i18n/navigation`
- ❌ Định nghĩa type mới nếu đã có trong `interface/response.ts`
- ❌ Import enum trực tiếp — luôn từ `@/common`

---

## Thư viện đặc biệt — khi nào dùng gì

### Notifications — Sonner (KHÔNG dùng shadcn Toast)

```typescript
import { toast } from "sonner";
toast.success("Đặt lịch thành công");
toast.error("Có lỗi xảy ra");
```

### Date — date-fns (KHÔNG dùng dayjs hay moment)

```typescript
import { format, parseISO } from "date-fns";
// Date format từ API: "16:00:00 15/05/2026" hoặc "dd/MM/yyyy"
```

### PDF — @react-pdf/renderer

Dùng để xuất hóa đơn/invoice. Components trong `InvoiceManagement/`.

### WebSocket — STOMP + SockJS

Dùng cho Chat feature. `@stomp/stompjs` + `sockjs-client`.

### Charts — Recharts

Dùng trong `DoctorDashboard/AppointmentChart`.

### Virtual List — @tanstack/react-virtual

Dùng khi render list dài (appointments, messages) để tránh lag.

### Carousel — Embla Carousel

```typescript
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
```

### Number formatting — react-number-format

Dùng cho input tiền tệ (consultationFee, invoice amounts).

---

## Utility Functions — `@/lib/utils`

> **Luôn dùng các hàm có sẵn, KHÔNG tự viết lại.**

### cn() — merge Tailwind classes

```typescript
import { cn } from "@/lib/utils";
cn("base", isActive && "active", className);
```

### Date / Time

```typescript
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDurationFromSeconds,
  toApiDate,
  formatDateToApi,
  parseDate,
} from "@/lib/utils";

formatDate("2025-01-15"); // "Jan 15, 2025"
formatDateToWeekday("2025-01-15"); // "Monday"
formatDateTime("2025-01-15T08:30:00"); // "Jan 15, 2025 · 08:30 AM"
formatTime("2025-01-15T08:30:00"); // "08:30 AM"
formatRelativeTime("2025-01-15T08:30:00"); // "3 hours ago"
formatDurationFromSeconds(5025); // "1h 23m 45s"

toApiDate(new Date()); // "2025-01-15"  → gửi lên API
formatDateToApi(date, "dd/MM/yyyy"); // "15/01/2025"  → API format
formatDateToApi(date, "HH:mm dd/MM/yyyy"); // "08:30 15/01/2025"

parseDate("15/01/2025", "dd/MM/yyyy"); // → Date object
parseDate("2025-01-15 08:30", "yyyy-MM-dd HH:mm"); // → Date object
```

**API date formats** (lưu ý khi parse response):

- `appointmentDate`: `"16:00:00 15/05/2026"` — dùng `parseDate(val, "HH:mm:ss dd/MM/yyyy")`
- `invoiceDate`: `"dd/MM/yyyy"` — dùng `parseDate(val, "dd/MM/yyyy")`

### Currency / Number

```typescript
import {
  formatVND,
  formatUSD,
  formatCurrency,
  formatCompactNumber,
  formatNumber,
} from "@/lib/utils";

formatVND(1500000); // "1.500.000 ₫"
formatUSD(1500); // "$1,500.00"
formatCurrency(1500000, "VND"); // "1.500.000 ₫"
formatCompactNumber(1500000); // "1.5M"
formatNumber(25000); // "25,000"
```

### Image URL

```typescript
import { getImageUrl } from "@/lib/utils";

// Tự động prefix NEXT_PUBLIC_API_BASE_URL nếu là relative path
// Fallback về ảnh Unsplash nếu null/undefined
getImageUrl(doctor.pathAvatar);
getImageUrl(null); // → fallback image
```

### Initials (Avatar)

```typescript
import { getInitials } from "@/lib/utils";
getInitials("Nguyen Van A"); // "VA"
getInitials("John Doe"); // "JD"
```

### Query Params

```typescript
import { buildQueryParams } from "@/lib/utils";

// Tự động bỏ qua: undefined, null, "", false, NaN, FILTER_ALL_VALUE
// Hỗ trợ array params
buildQueryParams({ page: 1, size: 10, status: undefined, tags: ["a", "b"] });
// → "page=1&size=10&tags=a&tags=b"
```

---

## API Layer — `@/hooks/global` + `@/hooks/swr`

### Response Types

```typescript
// Single item response — mọi API đều wrap trong ApiResponse
type ApiResponse<T> = {
  headers: Record<string, string>;
  body: T; // ← data thực sự nằm ở đây
  statusCode: string;
  statusCodeValue: number;
};

// Paginated list response — nằm trong body của ApiResponse
type ApiPagedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};
```

### useSWRWrapper — GET data

```typescript
import { useSWRWrapper } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { buildQueryParams } from "@/lib/utils";

// List (paginated)
export const useAppointments = (filter?: BaseFilter & { status?: APPOINTMENT_STATUS }) => {
  const query = buildQueryParams(filter);
  return useSWRWrapper<ApiPagedResponse<AppointmentResponse>>(
    `/api/v1/appointments?${query}`,
    { url: `/api/v1/appointments?${query}`, method: METHOD.GET }
  );
};
// → data.body.data[], data.body.total, data.body.totalPages

// Single item
export const useAppointmentDetail = (id: string) =>
  useSWRWrapper<AppointmentResponse>(`/api/v1/appointments/${id}`, {
    url: `/api/v1/appointments/${id}`,
    method: METHOD.GET,
    enable: !!id,   // chỉ fetch khi có id
  });
// → data.body (là AppointmentResponse)

// Tắt fetch có điều kiện
useSWRWrapper<T>(key, { enable: !!someCondition, ... })
```

**Options hay dùng:**

- `enable` — điều kiện fetch (default: `true`)
- `auth` — gửi Bearer token (default: `true`). Public API thì `auth: false`
- `notification.notifyOnErr` — tự toast.error khi lỗi
- `ignoreSuccessNotification` — mặc định `true` (không toast khi thành công)

### useMutation — POST / PUT / PATCH / DELETE

```typescript
import { useMutation } from "@/hooks/swr";

export function useCancelAppointment() {
  return useMutation<AppointmentResponse>("cancel-appointment", {
    url: "/api/v1/appointments/cancel",
    method: METHOD.PATCH,
    notification: { title: "Đã huỷ lịch hẹn" },
  });
}

// Dùng trong component
const { trigger, isMutating } = useCancelAppointment();

await trigger({ id: appointmentId });         // body là Record | FormData
await trigger(new FormData(...));             // upload file

// resultKey — sau khi mutate xong, tự revalidate key khác
useMutation("key", {
  url: "...",
  method: METHOD.POST,
  resultKey: "/api/v1/appointments?page=1",  // SWR tự refetch list này
});
```

### FILTER_ALL_VALUE

```typescript
import { FILTER_ALL_VALUE } from "@/hooks/global";

// buildQueryParams tự bỏ qua FILTER_ALL_VALUE khi build query string
// Dùng cho select "Tất cả" trong filter bar
const [status, setStatus] = useState<APPOINTMENT_STATUS | typeof FILTER_ALL_VALUE>(
  FILTER_ALL_VALUE
);
```

---

## Enums — `@/common`

> **Luôn import từ `@/common`, không hardcode string.**

```typescript
import {
  APPOINTMENT_STATUS,
  BOOKING_TYPE,
  BLOOD_TYPE,
  CONVERSATION_TYPE,
  DAY_STATUS,
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
```

| Enum                 | Values                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| `ROLE_NAME`          | ADMIN, DOCTOR, PATIENT, STAFF, GUEST                                       |
| `GENDER`             | MALE, FEMALE, OTHER                                                        |
| `USER_STATUS`        | ACTIVE, INACTIVE, BANNED                                                   |
| `APPOINTMENT_STATUS` | PENDING, CONFIRMED, CHECKED_IN, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW |
| `BOOKING_TYPE`       | ONLINE, PHONE, WALK_IN                                                     |
| `INVOICE_STATUS`     | DRAFT, PENDING, PAID, CANCELLED                                            |
| `INVOICE_ITEM_TYPE`  | SERVICE, MEDICATION, LAB_TEST, OTHER                                       |
| `REVIEW_STATUS`      | PENDING, APPROVED, REJECTED                                                |
| `MESSAGE_TYPE`       | TEXT, IMAGE, FILE                                                          |
| `MESSAGE_STATUS`     | SENT, DELIVERED, READ, RECALLED                                            |
| `CONVERSATION_TYPE`  | DIRECT, GROUP                                                              |
| `EXCEPTION_TYPE`     | LEAVE, EXTRA                                                               |
| `DAY_STATUS`         | available, full, overtime, disabled, leave                                 |
| `BLOOD_TYPE`         | A+, A-, B+, B-, AB+, AB-, O+, O-                                           |
| `SPECIALTY_TYPE`     | GENERAL, SURGERY, PEDIATRICS, DERMATOLOGY, CARDIOLOGY, ...                 |

---

## Component Patterns (học từ codebase thực tế)

### Default export vs Named export

Project dùng **cả hai** — không có rule tuyệt đối:

- **Page-level / container component** → `export default` (ví dụ `DetailDoctor`, `DoctorHeroSection`)
- **Shared UI component** → named export (ví dụ `LoginForm`, `AppointmentCard`)

```typescript
// Container (page-level)
const DetailDoctor = () => { ... }
export default DetailDoctor;

// Shared component
export function LoginForm({ className, ...props }: Props) { ... }
```

### Lấy data trong component — pattern chuẩn

```typescript
const { data } = usePublicDoctorById(doctorProfileId);
const doctorData = data?.body;           // single item → data.body
// const doctorData = data?.body.data;   // list → data.body.data[]

// Dùng optional chaining khi render (data có thể undefined lúc loading)
<h1>{doctorData?.user?.fullName}</h1>
<img src={getImageUrl(doctorData?.user?.pathAvatar)} />
```

### useParams — luôn type rõ

```typescript
// ✅
const { doctorProfileId } = useParams<{ doctorProfileId: string }>();

// ❌
const params = useParams();
```

### Image — luôn dùng next/image + getImageUrl

```typescript
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

// fill + relative parent
<div className="relative w-48 h-48 rounded-2xl">
  <Image
    src={getImageUrl(doctorData?.user?.pathAvatar)}
    alt={doctorData?.user?.fullName ?? ""}
    fill
    className="object-cover"
  />
</div>
```

### Tab pattern (local state)

```typescript
const [activeTab, setActiveTab] = useState("about");

<DoctorTabs activeTab={activeTab} onTabChange={setActiveTab} />
{activeTab === "about" && <AboutTab />}
{activeTab === "reviews" && <ReviewsTab />}
```

### Layout pattern — max-width container

```typescript
// Project dùng max-w-400 (custom) cho container chính
<div className="max-w-400 mx-auto px-4">
```

### Props — callback naming convention

```typescript
// on + động từ
interface Props {
  onBookAppointment: () => void;
  onMessage: () => void;
  onTabChange: (tab: string) => void;
}
```

### Lucide icons — import trực tiếp theo tên

```typescript
import { Star, Award, Users, Calendar, MessageCircle } from "lucide-react";

// Size qua className
<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
<Calendar className="w-5 h-5" />
```

---

## i18n — next-intl v4

### Locales & Config

```typescript
// i18n/config.ts
languages = [{ code: "en" }, { code: "vi" }]; // "en" là defaultLocale
type LanguageCode = "en" | "vi";

// Translation files
src / locales / en.json;
src / locales / vi.json;
```

### Navigation — KHÔNG dùng next/navigation

Tất cả navigation exports đều từ `@/i18n/navigation` — được wrap bởi next-intl để tự handle locale prefix:

```typescript
// ✅ Luôn dùng
import { Link, redirect, usePathname, useRouter, getPathname } from "@/i18n/navigation";

// ❌ Không bao giờ dùng trực tiếp
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
```

### Translations trong component

```typescript
// Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
<p>{t("key")}</p>

// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");
```

### Routing

```
defaultLocale: "en"
locales: ["en", "vi"]
localeDetection: true
localeCookie: "USER_LOCALE" (1 năm)
```

URL pattern: `/en/patient/appointments`, `/vi/doctor/profile`

---

## Middleware

Middleware chỉ làm 2 việc:

1. Validate locale từ URL — nếu không hợp lệ redirect về `/{defaultLocale}`
2. Chạy `intlMiddleware` để next-intl xử lý i18n routing

```
Matcher:
- /api/v1/:path*       → API proxy
- Tất cả route còn lại (trừ _next, static files)
```

**Lưu ý:** Middleware KHÔNG làm auth guard — không có redirect theo role ở đây. Auth guard xử lý ở tầng layout hoặc page.
