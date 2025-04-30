import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const DataTable = ({ columns, data }) => {
  // Init table
  const table = useReactTable({
    data: data.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto">
      <table className="w-full text-[15px]">
        <thead className="text-base tracking-wide text-zinc-700 dark:text-zinc-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="h-12 px-6 text-left text-dark-200 align-middle font-medium [&:has([role=checkbox])]:pr-0 whitespace-nowrap bg-light-100 border-y border-slate-300 bg-slate-50"
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
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="px-6 py-4 align-middle [&:has([role=checkbox])]:pr-0 max-w-[230px] truncate border-b"
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
