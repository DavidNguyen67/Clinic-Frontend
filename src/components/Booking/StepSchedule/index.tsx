const StepSchedule = () => {
  return <div>StepSchedule</div>;
};

export default StepSchedule;

// const StepSchedule = ({
//   date,
//   time,
//   onDateChange,
//   onTimeChange,
// }: {
//   date: string;
//   time: string;
//   onDateChange: (d: string) => void;
//   onTimeChange: (t: string) => void;
// }) => {
//   const today = new Date();
//   const [viewYear, setViewYear] = useState(today.getFullYear());
//   const [viewMonth, setViewMonth] = useState(today.getMonth());

//   const daysInMonth = getDaysInMonth(viewYear, viewMonth);
//   const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

//   const prevMonth = () => {
//     if (viewMonth === 0) {
//       setViewYear((y) => y - 1);
//       setViewMonth(11);
//     } else setViewMonth((m) => m - 1);
//   };
//   const nextMonth = () => {
//     if (viewMonth === 11) {
//       setViewYear((y) => y + 1);
//       setViewMonth(0);
//     } else setViewMonth((m) => m + 1);
//   };

//   const isPast = (d: number) => {
//     const cell = new Date(viewYear, viewMonth, d);
//     cell.setHours(0, 0, 0, 0);
//     const t = new Date();
//     t.setHours(0, 0, 0, 0);
//     return cell < t;
//   };

//   return (
//     <div className="space-y-5">
//       <div>
//         <h2 className="text-xl font-semibold text-gray-900">Pick a Date & Time</h2>
//         <p className="text-sm text-gray-400 mt-1">Select your preferred appointment slot</p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-5">
//         {/* Calendar */}
//         <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
//           <CardContent className="p-4">
//             {/* Month nav */}
//             <div className="flex items-center justify-between mb-4">
//               <button
//                 onClick={prevMonth}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4 text-gray-500" />
//               </button>
//               <span className="text-sm font-semibold text-gray-800">
//                 {MONTHS[viewMonth]} {viewYear}
//               </span>
//               <button
//                 onClick={nextMonth}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//               >
//                 <ChevronRight className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>

//             {/* Day headers */}
//             <div className="grid grid-cols-7 mb-2">
//               {WEEKDAYS.map((d) => (
//                 <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
//                   {d}
//                 </div>
//               ))}
//             </div>

//             {/* Days */}
//             <div className="grid grid-cols-7 gap-y-1">
//               {Array.from({ length: firstDay }).map((_, i) => (
//                 <div key={`e${i}`} />
//               ))}
//               {Array.from({ length: daysInMonth }).map((_, i) => {
//                 const d = i + 1;
//                 const ds = toDateStr(viewYear, viewMonth, d);
//                 const past = isPast(d);
//                 const selected = ds === date;
//                 return (
//                   <button
//                     key={d}
//                     disabled={past}
//                     onClick={() => onDateChange(ds)}
//                     className={cn(
//                       "h-8 w-full rounded-lg text-xs font-medium transition-all duration-150",
//                       past
//                         ? "text-gray-200 cursor-not-allowed"
//                         : selected
//                           ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                           : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//                     )}
//                   >
//                     {d}
//                   </button>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Time slots */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <Clock className="w-4 h-4" />
//             {date ? (
//               <span>
//                 Available slots for <span className="font-semibold text-gray-800">{date}</span>
//               </span>
//             ) : (
//               <span>Please select a date first</span>
//             )}
//           </div>

//           {date ? (
//             <div className="grid grid-cols-3 gap-2">
//               {TIME_SLOTS.map((slot) => {
//                 const unavail = UNAVAILABLE_SLOTS.includes(slot);
//                 const selected = slot === time;
//                 return (
//                   <button
//                     key={slot}
//                     disabled={unavail}
//                     onClick={() => onTimeChange(slot)}
//                     className={cn(
//                       "py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150",
//                       unavail
//                         ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
//                         : selected
//                           ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
//                           : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"
//                     )}
//                   >
//                     {slot}
//                   </button>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="h-40 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-100">
//               <div className="text-center">
//                 <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
//                 <p className="text-xs text-gray-300">Select a date to see available times</p>
//               </div>
//             </div>
//           )}

//           {date && (
//             <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
//               <span className="flex items-center gap-1.5">
//                 <span className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-600 inline-block" />{" "}
//                 Selected
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="w-3 h-3 rounded border-2 border-gray-200 inline-block" /> Available
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="w-3 h-3 rounded border-2 border-gray-100 bg-gray-50 inline-block" />{" "}
//                 Unavailable
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
