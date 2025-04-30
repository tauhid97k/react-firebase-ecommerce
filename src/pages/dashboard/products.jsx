import { DataTable } from "@/components/shared/table";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const AdminProductsPage = () => {
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
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Price",
      accessorKey: "price",
    },
    {
      header: "Whatsapp Number",
      accessorKey: "whatsapp number",
    },
    {
      header: "Action",
      accessorKey: "action",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Products</h1>

      <div className="border rounded-xl border-slate-200">
        <div className="p-6 flex items-center justify-between gap-4">
          {/* Search & Category */}
          <div className="flex items-center gap-4">
            <input
              name="search"
              type="search"
              placeholder="Search..."
              className="block max-w-md shrink-0 w-full rounded-md bg-slate-50 px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <select
              name="category"
              className="rounded-md bg-slate-50 shrink-0 w-full pl-2 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option>Category 1</option>
              <option>Category 2</option>
              <option>Category 3</option>
            </select>
          </div>
          <button
            type="button"
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Product
          </button>
        </div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default AdminProductsPage;
