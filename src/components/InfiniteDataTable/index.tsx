"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InfiniteDataTableProps<TData> {
  table: TanStackTable<TData>;

  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;

  emptyText?: string;
  loadingText?: string;

  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export function InfiniteDataTable<TData>({
  table,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  emptyText = "Không có dữ liệu",
  loadingText = "Đang tải dữ liệu...",
  onScroll,
}: InfiniteDataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  return (
    <div className="rounded-md border">
      <div className="max-h-150 overflow-auto" onScroll={onScroll}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                      aria-sort={
                        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="flex items-center gap-2"
                          disabled={!header.column.getCanSort()}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {sorted === "asc" && <span aria-hidden="true">↑</span>}

                          {sorted === "desc" && <span aria-hidden="true">↓</span>}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="h-24 text-center">
                  {loadingText}
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              <>
                {rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {isLoadingMore && (
                  <TableRow>
                    <TableCell colSpan={visibleColumnCount} className="h-16 text-center">
                      Đang tải thêm...
                    </TableCell>
                  </TableRow>
                )}

                {!hasMore && (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnCount}
                      className="h-12 text-center text-muted-foreground"
                    >
                      Đã tải hết dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="h-24 text-center">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
