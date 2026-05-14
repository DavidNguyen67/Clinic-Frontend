import { useBookingStore } from "@/components/Booking/useBookingStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <span className="text-sm text-gray-400 shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
  </div>
);

const StepSuccess = () => {
  const { store, resetBookingState } = useBookingStore();
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
        <CalendarCheck className="w-9 h-9 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-400 text-sm mt-2 max-w-sm">
          Your appointment has been successfully scheduled. A confirmation has been sent to your
          email and phone.
        </p>
      </div>
      <Card className="w-full border border-gray-100 rounded-2xl shadow-sm text-left">
        <CardContent className="p-4 divide-y divide-gray-50">
          <ReviewRow label="Doctor" value={store?.doctor?.user.fullName ?? "-"} />
          <ReviewRow label="Date & Time" value={`${store?.date} at ${store?.time}`} />
          <ReviewRow label="Type" value={store?.bookingType?.toString()!} />
        </CardContent>
      </Card>
      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={resetBookingState}>
          Book Another
        </Button>
        <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700" asChild>
          <a href="/appointments">View Appointments</a>
        </Button>
      </div>
    </div>
  );
};

export default StepSuccess;
