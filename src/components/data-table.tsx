import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonTable from "./skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoadingData?: boolean;
  variant?: {
    hoverable?: boolean;
    striped?: boolean;
    bordered?: boolean;
    fixedHeader?: boolean;
  };
  maxHeight?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoadingData,
  variant = {},
  maxHeight = "400px",
  className,
}: DataTableProps<TData, TValue>) {
  const {
    hoverable = false,
    striped = false,
    bordered = false,
    fixedHeader = false,
  } = variant;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoadingData) {
    return <SkeletonTable />;
  }

  const tableContent = (
    <Table
      className={cn(
        "relative",
        bordered && "border-separate border-spacing-0",
        className
      )}
    >
      <TableHeader
        className={cn(fixedHeader && "sticky top-0 z-10 bg-background")}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={cn(bordered && "border-b")}>
            {headerGroup.headers.map((header, index) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "whitespace-nowrap",
                    bordered && [
                      "border-r border-border",
                      index === 0 && "border-l",
                    ],
                    fixedHeader && "bg-background"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={cn(
                hoverable && "hover:bg-muted/50 transition-colors",
                striped && rowIndex % 2 === 1 && "bg-muted/25",
                bordered && "border-b"
              )}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "align-middle whitespace-nowrap",
                    bordered && [
                      "border-r border-border",
                      cellIndex === 0 && "border-l",
                    ]
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className={cn(bordered && "border-b")}>
            <TableCell
              colSpan={columns.length}
              className={cn(
                "h-24 text-center",
                bordered && "border-l border-r border-border"
              )}
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div
      className={cn(
        "rounded-md",
        !bordered && "border",
        bordered && "border border-border rounded-md overflow-hidden"
      )}
    >
      {fixedHeader ? (
        <div className="overflow-auto" style={{ maxHeight }}>
          {tableContent}
        </div>
      ) : (
        tableContent
      )}
    </div>
  );
}
