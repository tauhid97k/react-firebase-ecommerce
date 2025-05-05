import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const DataTable = ({ columns, data = [], isLoading = false }) => {
  // Init table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto">
      <table className="w-full text-[15px]">
        <thead className="text-base tracking-wide text-zinc-700 dark:text-zinc-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-slate-50">
              {headerGroup.headers.map((header) => (
                <th
                  className="h-12 px-6 text-left text-slate-700 align-middle font-medium [&:has([role=checkbox])]:pr-0 whitespace-nowrap border-y border-slate-300"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="h-28 text-center text-lg">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-300 last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="px-6 py-4 align-middle [&:has([role=checkbox])]:pr-0 max-w-[230px] truncate"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-28 text-center text-lg">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
