const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "All New Arrivals" },
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "sweatshirts", label: "Sweatshirts" },
      { value: "pants-shorts", label: "Pants & Shorts" },
    ],
  },
];

const products = [
  {
    id: 1,
    name: "Basic Tee 8-Pack",
    href: "#",
    price: "$256",
    description:
      "Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.",
    options: "8 colors",
    imageSrc:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-02-image-card-01.jpg",
    imageAlt:
      "Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "Black",
    imageSrc:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-02-image-card-02.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200 pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            All Categorie Products
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Checkout out the latest release of Basic Tees, new and improved with
            four openings!
          </p>
        </div>

        <div className="pt-12 pb-24 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside>
            <h2 className="text-sm font-medium text-gray-900 mb-6">Category</h2>
            <form className="space-y-4">
              {filters[0].options.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3">
                  <input
                    id={`filter-${index}`}
                    name="category"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`filter-${index}`}
                    className="text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </form>
          </aside>

          <section className="mt-10 lg:col-span-3 lg:mt-0">
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="aspect-square w-full object-cover bg-gray-100 group-hover:opacity-75"
                  />
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm italic text-gray-500">
                        {product.options}
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
