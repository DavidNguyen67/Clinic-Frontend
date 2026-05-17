// import React, { useRef } from "react";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
//
// interface VirtualizedSelectProps {
//   options?;
// }
//
// const VirtualizedSelect = ({ options }: { options: string[] }) => {
//   const parentRef = useRef<HTMLDivElement>(null);
//   // Initialize the virtualizer
//   const virtualizer = useVirtualizer({
//     count: options.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 35, // Approximate height of each item
//     overscan: 5, // Load extra items for smoother scrolling
//   });
//   const virtualItems = virtualizer.getVirtualItems();
//   return (
//     <Select>
//       <SelectTrigger className="w-[200px]">
//         <SelectValue placeholder="Select an option" />
//       </SelectTrigger>
//       <SelectContent>
//         <div
//           ref={parentRef}
//           style={{
//             height: "200px", // Set dropdown height
//           }}
//           className="overflow-auto"
//         >
//           <div
//             className="relative"
//             style={{
//               height: `${virtualizer.getTotalSize()}px`,
//             }}
//           >
//             {virtualItems.map((virtualItem) => (
//               <div
//                 key={virtualItem.index}
//                 className="absolute left-0 w-full"
//                 style={{
//                   top: `${virtualItem.start}px`,
//                 }}
//               >
//                 <SelectItem value={options[virtualItem.index]}>
//                   {options[virtualItem.index]}
//                 </SelectItem>
//               </div>
//             ))}
//           </div>
//         </div>
//       </SelectContent>
//     </Select>
//   );
// };
// export default VirtualizedSelect;
