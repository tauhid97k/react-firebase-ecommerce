import { DataTable } from "@/components/shared/table";

const AdminCategoriesPage = () => {
  const columns = [
    {
      header: "Image",
      accessorKey: "image",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Action",
      accessorKey: "action",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Categories</h1>

      <div className="border rounded-xl border-slate-200">
        <div className="p-6">
          <input
            name="search"
            type="search"
            placeholder="Search..."
            className="block max-w-md w-full rounded-md bg-slate-50 px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
