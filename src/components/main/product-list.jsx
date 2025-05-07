import { Link } from "react-router";
import { useLoaderData } from "react-router";



export default function ProductList() {
  // Get data from the loader
  const { categorizedProducts = [] } = useLoaderData() || {};
  const loading = !categorizedProducts || categorizedProducts.length === 0;

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <p className="text-center">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {categorizedProducts.map((category) => (
        <div key={category.id} className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {category.title}
            </h2>
            <Link
              to={`/category/${category.id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
            >
              See all {category.title}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
            {category.products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                  {product.images && product.images.length > 0 ? (
                    <img
                      alt={product.title}
                      src={product.images[0].url}
                      className="size-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                        e.target.classList.add('error');
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link to={`/products/${product.id}`}>
                    <span className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {categorizedProducts.length === 0 && (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <p className="text-center">No products available.</p>
        </div>
      )}
    </div>
  );
}
