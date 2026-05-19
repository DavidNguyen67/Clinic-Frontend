"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, MoreHorizontal, Printer, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate, parseDate } from "@/lib/utils";
import { useState } from "react";
import { InvoiceResponse } from "@/interface/response";
import { canTransitionStatus } from "@/components/InvoiceManagement/config";
import { InvoiceExpandedRow } from "@/components/InvoiceManagement/pagination/InvoiceExpandedRow";
import { InvoiceStatusBadge } from "@/components/InvoiceManagement/pagination/InvoiceStatusBadge";
import { InvoicePdfDocument } from "@/components/InvoiceManagement/Invoicepdfdocument";
import { pdf } from "@react-pdf/renderer";
import usePopup from "@/hooks/useDialog";
import { UpdateInvoiceStatusDialog } from "@/components/InvoiceManagement/UpdateInvoiceStatusDialog";
import { Dialog } from "@/components/ui/dialog";

interface InvoiceTableRowProps {
  invoice: InvoiceResponse;
}

export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  const [expanded, setExpanded] = useState(false);

  const canUpdate = canTransitionStatus(invoice.status);

  const handleExportPdf = async (invoice: InvoiceResponse) => {
    const blob = await pdf(<InvoicePdfDocument invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceCode}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const popup = usePopup<{ invoice: InvoiceResponse }>();

  const totalAmount = invoice.totalAmount;

  return (
    <>
      {/* ── Main row ── */}
      <TableRow
        className="h-12 cursor-pointer hover:bg-gray-50/80 transition-colors group"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Expand chevron */}
        <TableCell className="w-8 pl-4 pr-0">
          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        </TableCell>

        {/* Invoice code */}
        <TableCell className="font-mono text-xs font-semibold text-gray-700 w-36">
          {invoice.invoiceCode}
        </TableCell>

        {/* Patient */}
        <TableCell className="text-xs text-gray-700">
          <div className="font-medium">{invoice.patientProfile?.user?.fullName}</div>
          {invoice.patientProfile?.user?.phone && (
            <div className="text-[11px] text-gray-400">{invoice.patientProfile?.user?.phone}</div>
          )}
        </TableCell>

        {/* Date */}
        <TableCell className="text-xs text-gray-500 w-28">
          {formatDate(parseDate(invoice.invoiceDate, "dd/MM/yyyy"))}
        </TableCell>

        {/* Total */}
        <TableCell className="text-xs font-semibold text-gray-800 text-right w-32">
          {formatCurrency(totalAmount)}
        </TableCell>

        {/* Balance */}
        <TableCell
          className={`text-xs font-semibold text-right w-32 ${
            invoice.balance <= 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {formatCurrency(invoice.balance)}
        </TableCell>

        {/* Status */}
        <TableCell className="w-28">
          <InvoiceStatusBadge status={invoice.status} />
        </TableCell>

        {/* Actions */}
        <TableCell className="w-10 text-right pr-4" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 text-xs">
              <DropdownMenuItem className="text-xs gap-2" onClick={() => handleExportPdf(invoice)}>
                <Printer className="w-3.5 h-3.5" />
                Export PDF
              </DropdownMenuItem>

              {canUpdate && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs gap-2"
                    onClick={() => {
                      popup.openPopup({ invoice });
                    }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Update Status
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* ── Expanded row ── */}
      {expanded && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={8} className="p-0 border-b border-gray-100">
            <InvoiceExpandedRow invoice={invoice} />
          </TableCell>
        </TableRow>
      )}
      <Dialog open={popup?.open} onOpenChange={popup.onOpenChange}>
        <UpdateInvoiceStatusDialog
          invoice={popup.data?.invoice!}
          onClose={() => {
            popup.onOpenChange(false);
          }}
        />
      </Dialog>
    </>
  );
}
