"use client";

import { getCoreRowModel, type ColumnDef, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { InfiniteDataTable } from "@/components/InfiniteDataTable";
import type { ClinicServiceResponse } from "@/interface";
import { useClinicServices } from "@/components/AdminServices/hooks";
import { formatCurrency, formatNumber } from "@/lib/utils";

// Import hook thực tế của bạn
// import { useClinicServices } from "./hooks";

function formatPrice(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminServices() {
  const { fetchList } = useClinicServices();

  const [items, setItems] = useState<ClinicServiceResponse[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const queryingRef = useRef(false);
  const pageRef = useRef(0);

  const columns = useMemo<ColumnDef<ClinicServiceResponse>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Hình ảnh",
        size: 90,
        enableSorting: false,
        cell: ({ row }) => {
          const { image, name } = row.original;

          return (
            <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-md border bg-muted">
              {image ? (
                <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <span className="text-center text-xs text-muted-foreground">Không có ảnh</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Tên dịch vụ",
        size: 240,
        cell: ({ row }) => {
          const { name, description } = row.original;

          return (
            <div className="min-w-0 space-y-1">
              <p className="truncate font-medium">{name}</p>

              <p
                className="max-w-[260px] truncate text-xs text-muted-foreground"
                title={description}
              >
                {description || "Không có mô tả"}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        size: 190,
        cell: ({ getValue }) => <code className="text-xs">{getValue<string>()}</code>,
      },
      {
        id: "price",
        accessorKey: "price",
        header: "Giá dịch vụ",
        size: 160,
        cell: ({ row }) => {
          const { price, promotionalPrice } = row.original;
          const hasPromotion = promotionalPrice !== null && promotionalPrice < price;

          return (
            <div className="space-y-1 whitespace-nowrap">
              <p
                className={
                  hasPromotion ? "text-xs text-muted-foreground line-through" : "font-medium"
                }
              >
                {formatCurrency(price)}
              </p>

              {hasPromotion && (
                <p className="font-medium text-destructive">{formatCurrency(promotionalPrice)}</p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "duration",
        header: "Thời lượng",
        size: 120,
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap">{formatNumber(getValue<number>())} phút</span>
        ),
      },
      {
        accessorKey: "isFeatured",
        header: "Nổi bật",
        size: 100,
        cell: ({ getValue }) => {
          const isFeatured = getValue<boolean>();

          return (
            <span
              className={
                isFeatured
                  ? "inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
                  : "text-sm text-muted-foreground"
              }
            >
              {isFeatured ? "Có" : "Không"}
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Trạng thái",
        size: 140,
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();

          return (
            <span
              className={
                isActive
                  ? "inline-flex whitespace-nowrap rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                  : "inline-flex whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
              }
            >
              {isActive ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 170,
        cell: ({ getValue }) => {
          const createdAt = getValue<string>();

          return <span className="whitespace-nowrap">{formatDate(createdAt)}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const requestData = useCallback(async () => {
    if (queryingRef.current || !hasMore) return;

    queryingRef.current = true;

    if (pageRef.current === 0) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const payload = {
        page: pageRef.current,
      };

      const pageNewItems = await fetchList.trigger(payload);

      const newItems: ClinicServiceResponse[] = pageNewItems?.body?.data ?? [];

      if (newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((previousItems) => {
        const itemsMap = new Map<string, ClinicServiceResponse>();

        [...previousItems, ...newItems].forEach((item) => {
          itemsMap.set(item.id, item);
        });

        return Array.from(itemsMap.values());
      });

      pageRef.current += 1;
    } catch (error) {
      console.error("Không thể tải danh sách dịch vụ:", error);
    } finally {
      queryingRef.current = false;
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, [hasMore]);

  useEffect(() => {
    void requestData();
  }, [requestData]);

  return (
    <div className="flex h-full flex-1 flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dịch vụ phòng khám</h1>

          <p className="text-sm text-muted-foreground">Đã tải {items.length} dịch vụ</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col h-full overflow-hidden">
        <InfiniteDataTable
          table={table}
          isLoading={isInitialLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          emptyText="Không có dịch vụ nào"
          loadingText="Đang tải danh sách dịch vụ..."
          onScroll={(event) => {
            const element = event.currentTarget;

            const distanceToBottom =
              element.scrollHeight - element.scrollTop - element.clientHeight;

            if (distanceToBottom < 150) {
              void requestData();
            }
          }}
        />
      </div>
    </div>
  );
}
