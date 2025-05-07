import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { ArrowUpDown, Package, ArrowDown, ArrowUp, Layers } from "lucide-react";

export default function OverviewPage() {
  // Get data from the loader
  const loaderData = useLoaderData();
  
  // Initialize state with loader data
  const [categories] = useState(loaderData?.categories || []);
  const [products] = useState(loaderData?.products || []);
  const [selectedCategory, setSelectedCategory] = useState(loaderData?.selectedCategory || null);
  const [filteredProducts, setFilteredProducts] = useState(loaderData?.filteredProducts || []);
  const [isLoading] = useState(false); // Only for display purposes
  
  // Sorting states
  const [priceSort, setPriceSort] = useState(null); // null, 'asc', 'desc'
  const [stockSort, setStockSort] = useState(null); // null, 'asc', 'desc'
  
  // Update filtered products when category changes
  useEffect(() => {
    if (selectedCategory) {
      let filtered = products.filter(product => product.category_id === selectedCategory.id);
      
      // Apply price sorting
      if (priceSort === 'asc') {
        filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (priceSort === 'desc') {
        filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
      
      // Apply stock sorting
      if (stockSort === 'asc') {
        filtered = [...filtered].sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
      } else if (stockSort === 'desc') {
        filtered = [...filtered].sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
      }
      
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products, priceSort, stockSort]);
  
  // Toggle price sorting
  const togglePriceSort = () => {
    if (priceSort === null) setPriceSort('desc');
    else if (priceSort === 'desc') setPriceSort('asc');
    else setPriceSort(null);
    
    // Reset stock sort when price sort changes
    setStockSort(null);
  };
  
  // Toggle stock sorting
  const toggleStockSort = () => {
    if (stockSort === null) setStockSort('desc');
    else if (stockSort === 'desc') setStockSort('asc');
    else setStockSort(null);
    
    // Reset price sort when stock sort changes
    setPriceSort(null);
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">Dashboard Overview</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Categories Section */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${selectedCategory?.id === category.id ? 'ring-2 ring-indigo-500' : 'hover:shadow-md'}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {category.images && category.images.length > 0 ? (
                        <img 
                          src={category.images[0].url} 
                          alt={category.title}
                          className="h-14 w-14 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                          }}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-500">{category.productCount} Products</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Products Section */}
          {selectedCategory && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Products in {selectedCategory.title}</h2>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center ${priceSort ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={togglePriceSort}
                  >
                    Price
                    {priceSort === 'desc' && <ArrowDown size={16} className="ml-1" />}
                    {priceSort === 'asc' && <ArrowUp size={16} className="ml-1" />}
                    {priceSort === null && <ArrowUpDown size={16} className="ml-1" />}
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center ${stockSort ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={toggleStockSort}
                  >
                    Stock
                    {stockSort === 'desc' && <ArrowDown size={16} className="ml-1" />}
                    {stockSort === 'asc' && <ArrowUp size={16} className="ml-1" />}
                    {stockSort === null && <Layers size={16} className="ml-1" />}
                  </button>
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <p className="text-gray-500">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-gray-400" />
                          </div>
                        )}
                        {product.quantity <= 5 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            Low Stock: {product.quantity}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{product.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description || 'No description available'}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-lg font-bold text-gray-900">${parseFloat(product.price).toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Stock: {product.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
